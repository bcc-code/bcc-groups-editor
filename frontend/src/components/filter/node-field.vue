<template>
    <div class="py-1 pl-1 flex flex-wrap items-center gap-2 rounded bg-black bg-opacity-5">
        {{ fieldName }}
        <OperatorSelector v-model="operator" :schema="fieldSchema"/>
        <template v-if="filterOperatorsNull.includes(operator)"></template>
        <NodeFieldInput v-else v-model="fieldValue" :field-schema="fieldSchema" :is-multiple="filterOperatorsArray.includes(operator)"/>
        <BccButton size="xs" context="danger" variant="tertiary" :icon="CloseIcon" @click="emit('remove')"></BccButton>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import {FilterNodeField, SchemaField, FilterOperator, filterOperatorsNull, filterOperatorsArray} from '../../types'
import { BccButton } from '@bcc-code/design-library-vue';
import {  CloseIcon } from '@bcc-code/icons-vue';
import OperatorSelector from './operator-selector.vue';
import NodeFieldInput from './node-field-input.vue';
import { deepCopy, getFieldByKey, getNameByKey } from '../../schema-helpers';

const props = defineProps({
    modelValue: {
        type: Object as PropType<FilterNodeField>,
        required: true
    },
    schema: {
        type: Object as PropType<SchemaField[]>,
        required: true
    }
})

const fieldSchema = computed(() => {
    return getFieldByKey(props.schema, props.modelValue.field)
})

const fieldName = computed(() => {
    return getNameByKey(props.schema, props.modelValue.field)
})

const fieldValue = computed({
    get() {
        return props.modelValue.value
    },
    set(v : unknown) {
        const nodeCopy = deepCopy(props.modelValue)
        nodeCopy.value = v
        emit('update:modelValue', nodeCopy)
    }
})


const operator = computed({
    get() {
        return props.modelValue.operator
    },
    set(v : FilterOperator) {
        const modelCopy = deepCopy(props.modelValue)
        if(filterOperatorsNull.includes(modelCopy.operator)) {
            modelCopy.value = true
        }
        if(filterOperatorsArray.includes(v) && !filterOperatorsArray.includes(modelCopy.operator)) {
            modelCopy.value = []
        }

        modelCopy.operator = v

        emit('update:modelValue', modelCopy)
    }
})

const emit = defineEmits(['update:modelValue', 'remove'])


</script>