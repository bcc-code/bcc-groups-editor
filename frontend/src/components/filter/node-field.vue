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
import { PropType, computed, toRaw } from 'vue';
import {FilterNodeField, SchemaField, FilterOperator, filterOperatorsNull, filterOperatorsArray} from '../../types'
import { BccButton } from '@bcc-code/design-library-vue';
import {  CloseIcon } from '@bcc-code/icons-vue';
import OperatorSelector from './operator-selector.vue';
import NodeFieldInput from './node-field-input.vue';

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
    const fieldParts = props.modelValue.field.split(".")
    let schema = props.schema
    let fieldSchema:SchemaField | undefined
    for(const part of fieldParts) {
        fieldSchema = schema.find(f => f.key === part)
        if(!fieldSchema) throw Error("field does not exist")

        schema = fieldSchema.fields ?? []
    }
    if(!fieldSchema) throw Error("field does not exist")

    return fieldSchema
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

const fieldValue = computed({
    get() {
        return props.modelValue.value
    },
    set(v : unknown) {
        const nodeCopy = getNodeCopy()
        nodeCopy.value = v
        emit('update:modelValue', nodeCopy)
    }
})


const operator = computed({
    get() {
        return props.modelValue.operator
    },
    set(v : FilterOperator) {
        const modelCopy = getNodeCopy()
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

function getNodeCopy(): FilterNodeField {
    return structuredClone(toRaw(props.modelValue))
}

</script>