<template>
    <div class="relative" 
        ref="dropdown"
        :tabindex="1" 
        @focus="open"
        @blur="close"
        >
        <p class="cursor-pointer">Add a filter</p>

        <div v-if="isOpen" class="absolute bg-white shadow-md p-4 z-10">
            <slot :close="close"></slot>
        </div>
    </div>

</template>

<script setup lang="ts">
import {  ref } from 'vue';

const isOpen = ref(false)

const dropdown = ref<HTMLElement>()

function open() {
    isOpen.value = true
    dropdown.value?.focus()
}

function close() {
    isOpen.value = false
    dropdown.value?.blur()
}

</script>