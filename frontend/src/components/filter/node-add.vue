<template>

</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { FilterSchema } from '../../types';


const props = defineProps({
    schema: {
        type: Object as PropType<FilterSchema>,
        required: true
    }
})
</script>