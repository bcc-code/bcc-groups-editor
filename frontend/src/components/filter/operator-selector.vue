
<template>

    <BccSelect v-model="model">
        <option value="_eq">Equals</option>
        <option value="_neq">Not Equals</option>
        <option value="_gt">Is Greater Than</option>
        <option value="_gte">Is Greater Than Or Equal</option>
    </BccSelect>
</template>

<script setup lang="ts">

import { BccSelect } from '@bcc-code/design-library-vue';
import { ClientFilterOperator, SchemaField } from '../../types';
import { PropType, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String as PropType<ClientFilterOperator>,
        required: true
    },
    schema: {
        type: [String, Object] as PropType<SchemaField>,
    }
})


const model = computed({
    get() {
        return props.modelValue
    },
    set(v: ClientFilterOperator) {
        emit('update:modelValue', v)
    }
})

const emit = defineEmits<{
    'update:modelValue': [ClientFilterOperator]
}>()

</script>