<template>
    <div class="py-1 pl-1 rounded bg-black bg-opacity-5">
        <div class="flex items-center gap-2 pb-1">
            <BccSelect size="sm" class="w-20" v-model="operator">
                <option value="and">And</option>
                <option value="or">Or</option>
            </BccSelect>
            <NodeAdd :schema="schema" @add-node.self="addNode($event)"/>
            <BccButton size="xs" context="danger" variant="tertiary" :icon="CloseIcon" @click="emit('remove')"></BccButton>
        </div>
        <div class="grid grid-cols-1 gap-1 ml-3">
            <Node v-for="_, i of modelValue.nodes" :schema="schema" :modelValue="modelValue.nodes[i]" @update:model-value="updateNode($event, i)" @remove="removeNode(i)"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, toRaw } from 'vue';
import {FilterNode, FilterNodeLogical, SchemaField} from '../../types'
import { BccButton, BccSelect } from '@bcc-code/design-library-vue';
import { CloseIcon, } from '@bcc-code/icons-vue';
import Node from './node.vue';
import NodeAdd from './node-add.vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<FilterNodeLogical>,
        required: true
    },
    schema: {
        type: Object as PropType<SchemaField[]>,
        required: true
    }
})


const operator = computed({
    get() { return props.modelValue.operator},
    set(v: string) {
        const filterCopy = getFilterCopy()
        filterCopy.operator = v as 'and' | 'or'
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


const emit = defineEmits(['update:modelValue', 'remove'])

function getFilterCopy() {
    return structuredClone(toRaw(props.modelValue))
}

</script>