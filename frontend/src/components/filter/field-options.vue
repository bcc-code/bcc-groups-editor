<template>
    <option v-for="opt in options" :value="opt.value">{{ opt.name }}</option>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Schema } from '../../types';

type Option = {value: string, name: string}

const props = defineProps({
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
})

const options = computed<Option[]>(() => {
    const res: Option[] = []

    for(const field of Object.keys(props.schema)) {
        let name = field

        const fieldSchma = props.schema[field]
        if(typeof fieldSchma === 'object' && fieldSchma.name) {
            name = fieldSchma.name
        }

        res.push({value: field, name})
    }
    return res
}) 
</script>