<template>
    <div class="py-1 pl-1 flex flex-wrap items-center gap-2 rounded bg-black bg-opacity-5">

        <BccSelect size="sm" class="w-48" v-model="fieldName">
            <FieldOptions :schema="schema"/>
        </BccSelect>
        <OperatorSelector v-model="operator" :schema="fieldSchema"/>

        <template v-if="!nullOperators.includes(operator)">
            <BccCheckbox size="sm" v-if="fieldType === 'boolean'" v-model="fieldValue" :label="fieldValue ? 'True' : 'False'"/>
            <BccSelect size="sm" v-else-if="fieldChoices" v-model="fieldValue">
                <option v-for="c of fieldChoices">{{ c }}</option>
            </BccSelect>
            <BccInput v-else size="sm" v-model="fieldValueString"/>
        </template>

        <BccButton size="xs" context="danger" variant="tertiary" :icon="CloseIcon" @click="emit('remove')"></BccButton>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, toRaw } from 'vue';
import {FilterNodeField, Schema, ClientFilterOperator} from '../../types'
import { BccButton, BccCheckbox, BccInput, BccSelect } from '@bcc-code/design-library-vue';
import { CloseIcon } from '@bcc-code/icons-vue';
import OperatorSelector from './operator-selector.vue';
import FieldOptions from './field-options.vue';

const props = defineProps({
    modelValue: {
        type: Object as PropType<FilterNodeField>,
        required: true
    },
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
})

const fieldSchema = computed(() => {
    return props.schema[props.modelValue.field]
})

const fieldType = computed(() => {
    if(typeof fieldSchema.value === 'string') return fieldSchema.value
    return fieldSchema.value.type
})

const fieldChoices = computed(() => {
    if(typeof fieldSchema.value === 'string') return undefined
    return fieldSchema.value.choices
})

const fieldValue = computed({
    get() {
        return props.modelValue.value
    },
    set(v : any) {
        const modelCopy = getNodeCopy()
        modelCopy.value = v
        emit('update:modelValue', modelCopy)
    }
})

const fieldValueString = computed({
    get() {
        return fieldValue.value?.toString() ?? ''
    },
    set(v : string) {
        let value: any;
        switch(fieldType.value) {
            case 'integer': value = parseInt(v); break
            case 'float': value = parseFloat(v); break
            case 'boolean': value = v.toLowerCase() === 'true'; break
            default: value = v; break;
        }
        fieldValue.value = value
    }
})

const fieldName = computed({
    get() {
        return props.modelValue.field
    },
    set(v : string) {
        const modelCopy = getNodeCopy()

        modelCopy.field = v
        modelCopy.operator = '_eq'
        modelCopy.value = null
        emit('update:modelValue', modelCopy)

    }
})

const operator = computed({
    get() {
        return props.modelValue.operator
    },
    set(v : ClientFilterOperator) {
        const modelCopy = getNodeCopy()
        modelCopy.operator = v

        if(nullOperators.includes(v)) {
            modelCopy.value = true
        } else {
            modelCopy.value = null
        }
        emit('update:modelValue', modelCopy)
    }
})

const nullOperators = ["_null", "_nnull"] as ClientFilterOperator[]

const emit = defineEmits(['update:modelValue', 'remove'])

function getNodeCopy(): FilterNodeField {
    return structuredClone(toRaw(props.modelValue))
}

</script>