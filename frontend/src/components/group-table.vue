<template>
    <div class=" w-full flex justify-end mb-4">
    <BccInput
        :icon="SearchIcon"
        placeholder="Search"
        v-model="search"
        class=""
        />
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
            <BccBadge v-for="tag of item.tags" context="neutral">{{ tag }}</BccBadge>
        </template>
        <template #item.lastChangedDate="{ item }">
            <div :title="item.lastChangedDate">{{ formatDate(item.lastChangedDate) }}</div>
        </template>

        <template #item.actions="{ item }">
            <BccButton variant="tertiary" size="sm" :padding="false" @click="editItem(item.uid)">Edit</BccButton>
        </template>
    </BccTable>
</template>

<script setup lang="ts">
import { BccBadge, BccButton, BccInput, BccTable } from '@bcc-code/design-library-vue';
import { SearchIcon } from '@bcc-code/icons-vue';
import { onMounted, ref, watchEffect } from 'vue';

type Column = {
    key: string;
    text?: string;
    sortable?: boolean;
};
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

const groups = ref<Array<any>>([])

async function loadGroups() {
    let qry = ""
    if (sortBy.value) {
        qry += `&sort=${sortDirection.value === 'descending' ? '-' : ''}${sortBy.value}`
    }
     if (search.value) {
        qry += `&filter={"name": {"_contains": "${search.value}"}}`
    }
    const res = await fetch(`/api/groups?${qry}`)
    const resJson = await res.json()
    groups.value = resJson.data
}

onMounted(() => {
    loadGroups()
})

type Direction = 'ascending' | 'descending'

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



function formatDate(isoDate: string) {
    return new Date(isoDate).toLocaleDateString('en-us', { weekday:"short", year:"numeric", month:"long", day:"numeric"}) 
}

function editItem(uid: string) {
    console.log(uid)
}
</script>