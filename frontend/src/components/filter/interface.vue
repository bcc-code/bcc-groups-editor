
<template>
    {{ JSON.stringify(model) }}
    <Node v-bind="{schema}" v-model="model" />
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { FilterNode, Schema } from '../../types'
import Node from './node.vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
})


const emits = defineEmits(['update:modelValue'])

const model = computed({
    get() {
        return getNodesFromFilter( props.modelValue)
    },
    set(v: FilterNode) {
        emits('update:modelValue', getFilterFromNode(v))
    }
})

function getNodesFromFilter(f: string): FilterNode {
    console.log(f)
    return {
        type: 'logical',
        operator: 'or',
        nodes: [{
            type: 'field',
            field: 'name',
            operator: '_eq',
            value: 'Test'
        }]
    }
}

function getFilterFromNode(n: FilterNode): string {
    return JSON.stringify(n)
}

</script>