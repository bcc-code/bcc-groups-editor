<template>
    {{ selected }}
    <select class="add-node-select" value="" @input="add">
        <option>Or</option>
        <option>Name</option>
    </select>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { FilterSchema } from '../../types';


const props = defineProps({
    schema: {
        type: Object as PropType<FilterSchema>,
        required: true
    }
})

function add(e: Event) {
    if(!e.target) return
   
    selected.value.push(e.target.value)

    e.target.value = null

}

const selected = ref<any>([])


</script>

<style>
.add-node-select {
    @apply bg-primary;
    @apply rounded w-5;
    /* padding: 16px; */
}

</style>