<template>
    <div class="py-1 pl-1 rounded bg-black bg-opacity-5">
        <div class="flex items-center gap-2 pb-1">
            {{ fieldName }}
            <BccSelect size="sm" class="w-20" v-model="relationType">
                <option value="some">Some</option>
                <option value="none">None</option>
            </BccSelect>
            <NodeAdd :schema="subSchema" @add-node="addNode($event)"/>
            <BccButton size="xs" context="danger" variant="tertiary" :icon="CloseIcon" @click="emit('remove')"></BccButton>
        </div>
        <div class="grid grid-cols-1 gap-1 ml-3">
            <Node v-for="_, i of modelValue.nodes" :schema="subSchema" :modelValue="modelValue.nodes[i]" @update:model-value="updateNode($event, i)" @remove="removeNode(i)"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, toRaw, } from 'vue';
import {  FilterNode, FilterNodeRelationalMany, SchemaField} from '../../types'
import { BccButton, BccSelect } from '@bcc-code/design-library-vue';
import NodeAdd from './node-add.vue';
import { CloseIcon } from '@bcc-code/icons-vue';
import Node from './node.vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<FilterNodeRelationalMany>,
        required: true
    },
    schema: {
        type: Object as PropType<SchemaField[]>,
        required: true
    }
})

const subSchema = computed(() => {
    const fieldParts = props.modelValue.field.split(".")

    let schema = props.schema
    let fieldSchema:SchemaField | undefined
    for(const part of fieldParts) {
        fieldSchema = schema.find(f => f.key === part)
        if(!fieldSchema) throw Error("field does not exist")

        schema = fieldSchema.fields ?? []
    }
    if(!fieldSchema) throw Error("field does not exist")

    return fieldSchema.fields ?? []
})


const fieldName = computed(() => {
    const fieldParts = props.modelValue.field.split(".")

    let schema = props.schema
    let fieldNameParts = []
    for(const part of fieldParts) {
        const fieldSchema = schema.find(f => f.key === part)
        if(!fieldSchema) throw Error("field does not exist")
        fieldNameParts.push(fieldSchema.name)

        schema = fieldSchema.fields ?? []
    }

    return fieldNameParts.join("->")

})

const relationType = computed({
    get() { return props.modelValue.relType},
    set(v: string) {
        const filterCopy = getFilterCopy()
        filterCopy.relType = v as 'some' | 'none'
        emit('update:modelValue', filterCopy)
    }
})

function addNode(n: FilterNode) {
    const filterCopy = getFilterCopy()
    filterCopy.nodes.push(n)
    emit('update:modelValue', filterCopy)
}

function updateNode(n: FilterNode, ind: number) {
    const filterCopy = getFilterCopy()
    filterCopy.nodes[ind] =  n
    emit('update:modelValue', filterCopy)
}

function removeNode(ind: number) {
    const filterCopy = getFilterCopy()
    filterCopy.nodes.splice(ind, 1)
    emit('update:modelValue', filterCopy)
}

function getFilterCopy() {
    return structuredClone(toRaw(props.modelValue))
}

const emit = defineEmits(['update:modelValue', 'remove'])

</script>