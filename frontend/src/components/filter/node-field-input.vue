<template>
    <div v-if="isMultiple">
        <BccBadge v-for="(item, i) in (modelValue as unknown[])" context="neutral" icon-right :icon="DeleteIcon" class="cursor-pointer" @click="removeItem(i)">{{ item }}</BccBadge>
    </div>
    <BccCheckbox size="sm" v-if="fieldSchema.type === 'boolean'" v-model="(fieldValue as boolean)" :label="fieldValue ? 'True' : 'False'"/>
    <BccSelect size="sm" v-else-if="fieldSchema.choices" v-model="(fieldValue as string)">
        <option v-for="c of fieldSchema.choices">{{ c }}</option>
    </BccSelect>
    <BccInput v-else size="sm" v-model="fieldValueString"/>

    <BccButton v-if="isMultiple" size="sm" :icon="AddIcon" @click="addCurrentValue"></BccButton>

</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import { SchemaField } from '../../types';
import { BccBadge, BccButton, BccCheckbox, BccInput, BccSelect } from '@bcc-code/design-library-vue';
import { AddIcon, DeleteIcon } from '@bcc-code/icons-vue';
import { deepCopy } from '../../schema-helpers';


const props = defineProps({
    modelValue: {type: [String, Number, null, Array] as PropType<unknown>, required: true},
    isMultiple: {type: Boolean, default: false},
    fieldSchema: {type: Object as PropType<SchemaField>, required: true}
})

const currentValue = ref<unknown>(null)

const fieldValue = computed({
    get() {
        if(props.isMultiple) return currentValue.value
        return props.modelValue
    },
    set(v : unknown) {
        if(props.isMultiple) currentValue.value = v
        else emit('update:modelValue', v)
    }
})

const fieldValueString = computed({
    get() {
        return fieldValue.value?.toString() ?? ''
    },
    set(v : string) {
        let value: unknown;
        switch(props.fieldSchema.type) {
            case 'integer': value = parseInt(v); break
            case 'float': value = parseFloat(v); break
            case 'boolean': value = v.toLowerCase() === 'true'; break
            default: value = v; break;
        }
        fieldValue.value = value
    }
})

function addCurrentValue() {
    if(Array.isArray(props.modelValue)) {
        const valueCopy = deepCopy(props.modelValue)
        valueCopy.push(currentValue.value)
        emit('update:modelValue', valueCopy)
    } else {
        emit('update:modelValue', [currentValue.value])
    }
    currentValue.value = null
}

function removeItem(i: number) {
    if(!Array.isArray(props.modelValue)) {
        return
    }
    const valueCopy = deepCopy(props.modelValue)
    valueCopy.splice(i, 1);
    emit('update:modelValue', valueCopy)
}

const emit = defineEmits(['update:modelValue'])



</script>