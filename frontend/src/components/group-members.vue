<template>
    <h3 class="text-xl">Group members ({{ totalMembers }})</h3>
    <div class=" w-full flex justify-between mb-4 gap-4">
        <PersonSelect @select="addMember($event.uid)" :api="api" />
        <BccInput
            :icon="SearchIcon"
            placeholder="Search"
            v-model="search"
            class=""
            />
    </div>
    <BccTable :columns="columns" :items="members" :sortBy="sortBy" :sortDirection="sortDirection" @update:sortBy="updateSortBy" @update:sortDirection="updateSortDirection">
        <template #item.lastChangedDate="{ item }">
            <TableDate :date="item.lastChangedDate"/> 
       </template>
       <template #item.actions="{ item }">
            <BccButton variant="tertiary" size="sm" :padding="false" @click="removeMember(item.uid)">Delete</BccButton>
        </template>
    </BccTable>
</template>

<script setup lang="ts">
import { PropType, computed, ref, watchEffect } from 'vue';
import { Direction, Column, Group, Person } from '../types';
import { Api } from '../api';
import { BccButton, BccInput, BccTable } from '@bcc-code/design-library-vue';
import { SearchIcon } from '@bcc-code/icons-vue';
import TableDate from './table-date.vue';
import PersonSelect from './person-select.vue';

const props = defineProps({
    group: {type: Object as PropType<Group>, required: true},
    api: {type: Object as PropType<Api>, required: true}
})

const columns = computed(() => {
    const columns = [
        {text: "Uid", key: "uid"},
        {text: "Person ID", key: "personID"},
        {text: "Display Name", key: "displayName"},
    ] as Column[]

    if(props.group.type === 'Static') {
        columns.push(
            {text: "Actions", key: 'actions'}
        )
    }
    return columns
})

const members = ref<Person[]>([])
const totalMembers = ref(0)

async function loadMembers() {
    const res = await props.api.getGroupMembers(props.group, search.value, sortDirection.value, sortBy.value)
    members.value = res.data
    totalMembers.value = res.meta.total
}

async function addMember(personUid: string) {
    await props.api.addGroupMember(props.group.uid, personUid);
    await loadMembers()
}


async function removeMember(personUid: string) {
    await props.api.removeGroupMember(props.group.uid, personUid);
    await loadMembers()
}

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