<template>
    <VueMultiselect
        class="w-48 person-select"
        @update:modelValue="emit('select', $event)"
        :options="persons"
        :searchable="true"
        :close-on-select="false"
        :clear-on-select="true"
        @search-change="findPersons"
        placeholder="Add a person"
        label="displayName"
    >
        <template v-slot:option="props">
            <div class="hover:bg-slate-200">{{ props.option.displayName }}</div>
        </template>
    </VueMultiselect>
</template>

<script setup lang="ts">
import {Person} from '../types'
import { PropType, ref } from 'vue';
import VueMultiselect from 'vue-multiselect'

import { Api } from '../api';

const props = defineProps({
    api: {type: Object as PropType<Api>, required: true}
})


const persons = ref<Person[]>([])


async function findPersons(s: string) {
    if(!s) {
        persons.value = []
        return
    };
    persons.value = await props.api.findPersons(s)
}


const emit = defineEmits<{
    select: [Person]
}>()

</script>

<style>

</style>