
<template>
    <Node v-bind="{schema}" v-model="model" />
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Filter, FilterNode,ClientFilterOperator, SchemaField } from '../../types'
import Node from './node.vue';
import { FieldFilterOperator } from '../../types';

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
        const filterObj: Filter = JSON.parse(props.modelValue ? props.modelValue : '{}')
        const f = getNodesFromFilter(filterObj, props.schema)
        if (!f) {
            return {
                type: 'logical',
                nodes: [],
                operator: 'and'
            }
        }
        if (f.type != 'logical') {
            return {
                type: 'logical',
                nodes: [f],
                operator: 'and'
            }
        }
        return f
    },
    set(v: FilterNode) {
        const filterObj = getFilterFromNode(v)
        emits('update:modelValue', JSON.stringify(filterObj) )
    }
})

function getNodesFromFilter(filter: Filter, schema: SchemaField[], prefix = ''): FilterNode | undefined {
    const nodes: FilterNode[] = []

    const logicalOperators = ['_and', '_or'] as const

    for(const op of logicalOperators) {
        if ( op in filter) {
            const subfilters = filter[op as never] as Filter[]
            const subnodes = subfilters.map(f => getNodesFromFilter(f, schema, prefix)).filter(f => f !== undefined) as FilterNode[]
            nodes.push({ 
                type: 'logical',
                operator: op == '_and' ? 'and': 'or',
                nodes:subnodes
            })
        }
    }

    for(const field of Object.keys(filter)) {
        let fieldSchema = schema.find(f => f.key === field)
        if(!fieldSchema) continue

        if(fieldSchema.type === 'object') {
            const subnode = getNodesFromFilter(filter[field as never] as Filter, fieldSchema.fields ?? [], field)
            if(subnode)
                nodes.push(subnode)
            continue;
        }

        const fieldFilter = filter[field as never] as FieldFilterOperator

        for(const op of Object.keys(fieldFilter)) {
            let fieldJoined = prefix ? `${prefix}.${field}`: field;

            nodes.push({
                type: 'field',
                field: fieldJoined,
                operator: op as ClientFilterOperator,
                value: fieldFilter[op as never]
            })
        }

    }

    if (nodes.length === 0) return undefined
    if (nodes.length === 1) return nodes[0]

    return {
        type: 'logical',
        operator: 'and',
        nodes
    }
}

function getFilterFromNode(n: FilterNode): Record<string, any> {
    switch(n.type) {
        case 'logical':
            let op = '_and'
            if (n.operator == 'or') op = '_or' 
            return { [op]: n.nodes.map(getFilterFromNode)  }
        
        case 'field': {
            const fieldParts = n.field.split(".")
            let filter =  { [fieldParts.pop() ?? '']: {[n.operator]: n.value} }

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