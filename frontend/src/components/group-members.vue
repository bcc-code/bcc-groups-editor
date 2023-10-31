<template>
    <h3 class="text-xl">Group members</h3>
    <div class=" w-full flex justify-between mb-4 gap-4">
        <BccInput
            :icon="SearchIcon"
            placeholder="Search"
            v-model="search"
            class=""
            />
    </div>
    <BccTable :columns="columns" :items="members" :sortBy="sortBy" :sortDirection="sortDirection" @update:sortBy="updateSortBy" @update:sortDirection="updateSortDirection">

    </BccTable>
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from 'vue';
import { Direction, Group, Person,Column } from '../types';
import { Api } from '../api';
import { BccInput, BccTable } from '@bcc-code/design-library-vue';
import { SearchIcon } from '@bcc-code/icons-vue';

const columns = [
    {text: "Uid", key: "uid"},
    {text: "Person ID", key: "personID"},
    {text: "Display Name", key: "displayName"},
] as Column[]


const props = defineProps({
    group: {type: Object as PropType<Group>, required: true},
    api: {type: Object as PropType<Api>, required: true}
})

const members = ref<Person[]>([])

async function loadMembers() {
    members.value = await props.api.getGroupMembers(props.group.uid, search.value, sortDirection.value, sortBy.value)
}

onMounted(() => {
    loadMembers()
})

const sortBy = ref<string>()
const sortDirection = ref<Direction>('ascending')

function updateSortBy(field: string) {
    sortBy.value = field
    loadMembers()
}

function updateSortDirection(direction: Direction) {
    sortDirection.value = direction
    loadMembers()
}

const search = ref("")

watchEffect(() => {
    search;
    loadMembers();
})



</script> 