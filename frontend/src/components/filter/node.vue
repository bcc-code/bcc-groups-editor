<template>
    <NodeLogical v-if="model.type == 'logical'" :schema="schema" v-model="model"/>
    <NodeField v-else-if="model.type == 'field'" :schema="schema" v-model="model"/>
    <NodeRelation v-else-if="model.type == 'relational-many'" :schema="schema" v-model="model"/>
    <div v-else>unsupported</div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { FilterNode, SchemaField } from '../../types';
import NodeLogical from './node-logical.vue';
import NodeField from './node-field.vue';
import NodeRelation from './node-relation.vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<FilterNode>,
        required: true
    },
    schema: {
        type: Object as PropType<SchemaField[]>,
        required: true
    }
})

const model = computed({
    get() {
        return props.modelValue
    },
    set(v: FilterNode) {
        emit('update:modelValue', v)
    }
})

const emit = defineEmits(['update:modelValue'])

</script>