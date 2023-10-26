
<template>
    <BccInput v-model="model"/>
    <Node v-if="baseNode" v-bind="{schema}" v-model="baseNode" />
</template>

<script setup lang="ts">
import {BccInput} from '@bcc-code/design-library-vue'
import { PropType, computed, ref } from 'vue';
import { FilterNode, FilterSchema } from '../../types'
import Node from './node.vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    schema: {
        type: Object as PropType<FilterSchema>,
        required: true
    }
})

const baseNode = ref<FilterNode>({
    type: 'logical',
    operator: 'or',
    nodes: [{
        type: 'logical',
        operator: 'or',
        nodes: []
    }, {
        type: 'logical',
        operator: 'or',
        nodes: []
    }]
})

const emits = defineEmits(['update:modelValue'])

const model = computed({
    get() {
        return props.modelValue
    },
    set(v: string) {
        emits('update:modelValue', v)
    }
})

</script>