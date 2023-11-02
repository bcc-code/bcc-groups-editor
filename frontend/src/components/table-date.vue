<template>
    <div :title="date">{{ dateFormatted }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';


const props = defineProps({
    date: {type: String},
})

const dateFormatted = computed(() => {
    if(!props.date) return ''
    return new Date(props.date).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"long", day:"numeric"}) 
})
</script>