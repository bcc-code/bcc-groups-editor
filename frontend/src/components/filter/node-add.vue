<template>
    <!-- {{ selected }} -->
    <select class="add-node-select" value="" @input="add">
        <option value="logical">And/Or group</option>
        <FieldOptions :schema="schema"/>
    </select>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { FilterNode, Schema } from '../../types';
import FieldOptions from './field-options.vue';

defineProps({
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
})

function add(e: Event) {
    if(!(e.target instanceof HTMLSelectElement)) return

    if(e.target.value == 'logical') {
        emit('addNode', {
            type: 'logical',
            operator: 'and',
            nodes: []
        } )
    }
    else {
        emit('addNode', {
            type: 'field',
            field: e.target.value,
            operator: '_eq',
            value: undefined
        })
    }

    e.target.value = ""
}

const emit = defineEmits<{
    addNode: [FilterNode]
}>()

</script>

<style>
.add-node-select {
    @apply bg-primary;
    @apply rounded w-5;
    /* padding: 16px; */
}

</style>