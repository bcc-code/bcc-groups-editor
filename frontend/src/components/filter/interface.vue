
<template>
    <Node v-bind="{schema}" v-model="model" />
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { FilterNode,FilterOperator, SchemaField, logicalOperators, relationOperators } from '../../types'
import Node from './node.vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    schema: {
        type: Object as PropType<SchemaField[]>,
        required: true
    }
})


const emits = defineEmits(['update:modelValue'])

const model = computed<FilterNode>({
    get() {
        const filterObj: Record<string, unknown> = JSON.parse(props.modelValue ? props.modelValue : '{}')
        const f = getNodesFromFilter(filterObj, props.schema)
        if (!f) {
            return {
                type: 'logical',
                nodes: [],
                operator: '_and'
            }
        }
        if (f.type != 'logical') {
            return {
                type: 'logical',
                nodes: [f],
                operator: '_and'
            }
        }
        return f
    },
    set(v: FilterNode) {
        const filterObj = getFilterFromNode(v)
        emits('update:modelValue', JSON.stringify(filterObj) )
    }
})

function getNodesFromFilter(filter: Record<string, unknown>, schema: SchemaField[], prefix = ''): FilterNode | undefined {
    const nodes: FilterNode[] = []


    for(const op of logicalOperators) {
        if (!( op in filter)) {
            continue;
        }
        const subfilters = filter[op] as Record<string, unknown>[]
        const subnodes = subfilters.map(f => getNodesFromFilter(f, schema, prefix)).filter(f => f !== undefined) as FilterNode[]
        nodes.push({ 
            type: 'logical',
            operator: op,
            nodes:subnodes
        })
        
    }

    for(const field of Object.keys(filter)) {
        let fieldSchema = schema.find(f => f.key === field)
        if(!fieldSchema) continue

        if(fieldSchema.type === 'object') {
            const subnode = getNodesFromFilter(filter[field] as Record<string, unknown>, fieldSchema.fields ?? [], joinPrefix(field,prefix))
            if(subnode)
                nodes.push(subnode)
            continue;
        }
        if(fieldSchema.type === 'relational-many') {
            const fieldFilter = filter[field] as Record<string, unknown>

            for(const op of relationOperators) {
                if (!( op in fieldFilter)) {
                    continue;
                }
                const subfilter = fieldFilter[op] as Record<string, unknown>
                const subnode = getNodesFromFilter(subfilter, fieldSchema.fields ?? [])
                if (!subnode) continue;


                let subnodes = [subnode]
                if (subnode.type === 'logical' && subnode.operator === '_and') subnodes = subnode.nodes
                nodes.push({ 
                    type: 'relational-many',
                    operator: op,
                    nodes: subnodes,
                    field: joinPrefix(field,prefix)
                })
                delete filter[op as never]
            }

            const subnode = getNodesFromFilter(fieldFilter, fieldSchema.fields ?? [], field)
            if(!subnode) {
                continue;
            }

            let subnodes = [subnode]
            if (subnode.type === 'logical' && subnode.operator === '_and') subnodes = subnode.nodes

            nodes.push({
                type: 'relational-many',
                field: joinPrefix(field,prefix),
                operator: '_some',
                nodes: subnodes
            })
            continue;
        }

        const fieldFilter = filter[field] as Record<string, unknown>

        for(const op of Object.keys(fieldFilter)) {
            nodes.push({
                type: 'field',
                field: joinPrefix(field,prefix),
                operator: op as FilterOperator,
                value: fieldFilter[op as never]
            })
        }

    }

    if (nodes.length === 0) return undefined
    if (nodes.length === 1) return nodes[0]

    return {
        type: 'logical',
        operator: '_and',
        nodes
    }
}

function joinPrefix(field: string, prefix: string): string {
    if(!prefix) return field;
    return `${prefix}.${field}`
}

function getFilterFromNode(n: FilterNode): Record<string, unknown> {
    switch(n.type) {
        case 'logical':
        
            return { [n.operator]: n.nodes.map(getFilterFromNode)  }
        
        case 'field': {
            const fieldParts = n.field.split(".")
            let filter =  { [fieldParts.pop() ?? '']: {[n.operator]: n.value} }

            let fieldPart: string | undefined
            while(fieldPart = fieldParts.pop()) {
                filter = {[fieldPart]: filter}
            }
            return filter
        }

        case 'relational-many': {
            const fieldParts = n.field.split(".")

            let filter: Record<string, unknown> = { [fieldParts.pop() ?? '']: { [n.operator]: { _and: n.nodes.map(getFilterFromNode)  } }}

            let fieldPart: string | undefined
            while(fieldPart = fieldParts.pop()) {
                filter = {[fieldPart]: filter}
            }
            return filter
        }
        
        default:
            return {}
    }
}

</script>