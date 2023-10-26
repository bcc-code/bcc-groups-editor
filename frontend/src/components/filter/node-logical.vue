<template>
    <div class="py-4 pl-4 rounded bg-black bg-opacity-5">
        <div class="flex items-center gap-2">
            <BccButton size="xs" :variant="'tertiary'" @click="swapOperator">{{ model.operator.toUpperCase() }}</BccButton>
            <NodeAdd :schema="schema"/>
            <BccButton size="xs" context="danger" :icon="RemoveIcon" @click="emit('remove')"></BccButton>
        </div>
        {{ modelValue }}
        {{ schema }}
        <div class="grid grid-cols-1 gap-2">
            <Node v-for="_, i of model.nodes" :schema="schema" v-model="model.nodes[i]" @remove="model.nodes.splice(i, 1)"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, toRaw, toRef, watch } from 'vue';
import {FilterNodeLogical, FilterSchema} from '../../types'
import { BccButton } from '@bcc-code/design-library-vue';
import { AddIcon, RemoveIcon } from '@bcc-code/icons-vue';
import Node from './node.vue';
import NodeAdd from './node-add.vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<FilterNodeLogical>,
        required: true
    },
    schema: {
        type: Object as PropType<FilterSchema>,
        required: true
    }
})

const model = toRef(structuredClone(toRaw(props.modelValue)))
watch(model, (v) => {
    emit('update:modelValue', v)
}, {deep: true})


function swapOperator() {
    const valCopy = JSON.parse(JSON.stringify(props.modelValue)) as FilterNodeLogical
    valCopy.operator = props.modelValue.operator === 'and' ? 'or' : 'and'
    emit('update:modelValue', valCopy)
}

const emit = defineEmits(['update:modelValue', 'remove'])

</script>