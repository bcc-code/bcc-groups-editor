<template>
    <div class="py-1 pl-1 rounded bg-black bg-opacity-5">
        <div class="flex items-center gap-2 pb-1">
            <BccSelect size="sm" class="w-20" v-model="operator">
                <option value="_and">And</option>
                <option value="_or">Or</option>
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
import { PropType, computed } from 'vue';
import {FilterNode, FilterNodeLogical, LogicalOperator, SchemaField} from '../../types'
import { BccButton, BccSelect } from '@bcc-code/design-library-vue';
import { CloseIcon, } from '@bcc-code/icons-vue';
import Node from './node.vue';
import NodeAdd from './node-add.vue';
import { deepCopy } from '../../schema-helpers';

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
        const filterCopy = deepCopy(props.modelValue)
        filterCopy.operator = v as LogicalOperator
        emit('update:modelValue', filterCopy)
    }
})

function addNode(n: FilterNode) {
    const filterCopy = deepCopy(props.modelValue)
    filterCopy.nodes.push(n)
    emit('update:modelValue', filterCopy)
}

function updateNode(n: FilterNode, ind: number) {
    const filterCopy = deepCopy(props.modelValue)
    filterCopy.nodes[ind] =  n
    emit('update:modelValue', filterCopy)
}

function removeNode(ind: number) {
    const filterCopy = deepCopy(props.modelValue)
    filterCopy.nodes.splice(ind, 1)
    emit('update:modelValue', filterCopy)
}

const emit = defineEmits(['update:modelValue', 'remove'])

</script>