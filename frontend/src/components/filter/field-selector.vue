
<template>
    <BccSelect v-model="model">
        <FieldOptions :schema="schema"/>
    </BccSelect>
</template>

<script setup lang="ts">

import { BccSelect } from '@bcc-code/design-library-vue';
import { Schema } from '../../types';
import { PropType, computed } from 'vue';
import FieldOptions from './field-options.vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: true
    },
    schema: {
        type: [String, Object] as PropType<Schema>,
        required: true
    }
})


const model = computed({
    get() {
        return props.modelValue
    },
    set(v: string) {
        emit('update:modelValue', v)
    }
})

const emit = defineEmits<{
    'update:modelValue': [string]
}>()

</script>