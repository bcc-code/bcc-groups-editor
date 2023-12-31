<template>
    <div class=" w-full flex justify-end mb-4 gap-4">
        <BccInput
            :icon="SearchIcon"
            placeholder="Search"
            v-model="search"
            class=""
            />
        <BccButton :icon="AddIcon" @click="$emit('addGroup')">New</BccButton>
    </div>
    <BccTable :columns="columns" :items="groups" :sortBy="sortBy" :sortDirection="sortDirection" @update:sortBy="updateSortBy" @update:sortDirection="updateSortDirection">
        <template #item.uid="{ item }">
            <div class="text-ellipsis w-16 overflow-hidden" :title="item.uid">{{ item.uid }}</div>
        </template>
        <template #item.appUid="{ item }">
            <div class="text-ellipsis w-16 overflow-hidden" :title="item.appUid">{{ item.appUid }}</div>
        </template>
        <template #item.orgUid="{ item }">
            <div class="text-ellipsis w-16 overflow-hidden" :title="item.orgUid">{{ item.orgUid }}</div>
        </template>
        <template #item.tags="{ item }">
            <div class="flex flex-wrap gap-2">
                <BccBadge v-for="tag of item.tags" context="neutral" class="cursor-pointer" @click="search = tag">{{ tag }}</BccBadge>
            </div>
        </template>
        <template #item.lastChangedDate="{ item }">
            <TableDate :date="item.lastChangedDate"/> 
       </template>

        <template #item.actions="{ item }">
            <BccButton variant="tertiary" size="sm" :padding="false" @click="editItem(item.uid)">Edit</BccButton>
        </template>
    </BccTable>
</template>

<script setup lang="ts">
import { BccBadge, BccButton, BccInput, BccTable } from '@bcc-code/design-library-vue';
import { AddIcon, SearchIcon } from '@bcc-code/icons-vue';
import { PropType, ref, watchEffect } from 'vue';
import { Column, Direction, Group } from '../types';
import { Api } from '../api';
import TableDate from './table-date.vue';

const columns = [
    {text: "Uid", key: "uid"},
    {text: "Name", key: "name"},
    {text: "Type", key: "type"},
    {text: "Tags", key: "tags", sortable: false},
    {text: "Org Uid", key: "orgUid"},
    {text: "App Uid", key: "appUid"},
    {text: "Last Changed Date", key: "lastChangedDate"},
    {text: "Actions", key: "actions", sortable: false},
] as Column[]


const props = defineProps({
    api: {type: Object as PropType<Api>, required: true}
})

const groups = ref<Group[]>([])

async function loadGroups() {
    groups.value = await props.api.getGroups(search.value, sortDirection.value, sortBy.value)
}

const sortBy = ref<string>()
const sortDirection = ref<Direction>('ascending')

function updateSortBy(field: string) {
    sortBy.value = field
    loadGroups()
}

function updateSortDirection(direction: Direction) {
    sortDirection.value = direction
    loadGroups()
}

const search = ref("")

watchEffect(() => {
    search;
    loadGroups();
})


const emits = defineEmits(['editGroup', 'addGroup'])

function editItem(uid: string) {
    emits("editGroup", uid)
}
</script>