
<template>

    <BccSelect size="sm" v-model="model">
        <option value="_eq">Equals</option>
        <option value="_neq">Not Equals</option>
        <option value="_in">Is One Of</option>
        <option value="_nin">Is Not One Of</option>
        <option value="_null">Is Null</option>
        <option value="_nnull">Is Not Null</option>
        <template v-if="isSortable">
            <option value="_gt">Is Greater Than</option>
            <option value="_gte">Is Greater Than Or Equal</option>
            <option value="_lt">Is Less Than</option>
            <option value="_lte">Is Less Than Or Equal</option>
        </template>
        <template v-if="canContain">
            <option value="_contains">Contains</option>
            <option value="_ncontains">Does Not Contain</option>
        </template>
        <template v-if="fieldType === 'string'">
            <option value="_starts_with">Starts With</option>
            <option value="_nstarts_with">Does Not Start With</option>
            <option value="_ends_with">Ends With</option>
            <option value="_nends_with">Does Not End With</option>
        </template>
    </BccSelect>
</template>

<script setup lang="ts">

import { BccSelect } from '@bcc-code/design-library-vue';
import { FilterOperator, SchemaField } from '../../types';
import { PropType, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String as PropType<FilterOperator>,
        required: true
    },
    schema: {
        type: [String, Object] as PropType<SchemaField>,
        required: true
    }
})


const model = computed({
    get() {
        return props.modelValue
    },
    set(v: FilterOperator) {
        emit('update:modelValue', v)
    }
})

const fieldType = computed(() => {
    if(typeof props.schema === 'string') return props.schema
    return props.schema.type
})

const isSortable = computed(() => {
    switch(fieldType.value) {
        case 'date':
        case 'date-time':
        case 'string':
        case 'integer':
        case 'float':
            return true
        default:
            return false
    }
})

const canContain = computed(() => {
    switch(fieldType.value) {
        case 'string':
            return true
        default:
            return false
    }
})

const emit = defineEmits<{
    'update:modelValue': [FilterOperator]
}>()

</script>