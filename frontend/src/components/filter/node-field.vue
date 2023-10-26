<template>
    <div class="py-4 pl-4 flex items-center gap-4 rounded bg-black bg-opacity-5">

        <BccSelect class="w-48" v-model="model.field">
            <!-- <option>Full Name</option> -->
            <FieldOptions :schema="schema"/>
        </BccSelect>
        <OperatorSelector v-model="model.operator"/>
        <BccInput v-model="model.value"/>

        <BccButton size="xs" context="danger" :icon="RemoveIcon" @click="emit('remove')"></BccButton>
    </div>
</template>

<script setup lang="ts">
import { PropType, toRaw, toRef, watch } from 'vue';
import {FilterNodeField, Schema} from '../../types'
import { BccButton, BccInput, BccSelect } from '@bcc-code/design-library-vue';
import { RemoveIcon } from '@bcc-code/icons-vue';
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

// const fieldSchema = computed(() => {
//     return props.schema[props.modelValue.field]
// })


const model = toRef(structuredClone(toRaw(props.modelValue)))
watch(model, (v) => {
    emit('update:modelValue', v)
}, {deep: true})


const emit = defineEmits(['update:modelValue', 'remove'])

</script>