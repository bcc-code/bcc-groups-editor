<template>
    <h3 class="text-xl">Group members</h3>
    <div class=" w-full flex justify-between mb-4 gap-4">
        <PersonSelect @select="addMember($event.uid)" :api="api" />
        <BccInput
            :icon="SearchIcon"
            placeholder="Search"
            v-model="search"
            class=""
            />
    </div>
    <BccTable :columns="columns" :items="membersFormatted" :sortBy="sortBy" :sortDirection="sortDirection" @update:sortBy="updateSortBy" @update:sortDirection="updateSortDirection">
        <template #item.lastChangedDate="{ item }">
            <TableDate :date="item.lastChangedDate"/> 
       </template>
       <template #item.actions="{ item }">
            <BccButton variant="tertiary" size="sm" :padding="false" @click="removeMember(item.uid)">Delete</BccButton>
        </template>
    </BccTable>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref, watchEffect } from 'vue';
import { Direction, GroupMember, Column, GroupType } from '../types';
import { Api } from '../api';
import { BccButton, BccInput, BccTable } from '@bcc-code/design-library-vue';
import { SearchIcon } from '@bcc-code/icons-vue';
import TableDate from './table-date.vue';
import PersonSelect from './person-select.vue';

type GroupMemberFormatted = {
    uid: string;
    personUid: string;
    personID: string;
    displayName: string;
    lastChangedDate: string;
}

const props = defineProps({
    groupUid: {type: String, required: true},
    type: {type: String as PropType<GroupType>, required: true},
    api: {type: Object as PropType<Api>, required: true}
})

const columns = computed(() => {
    const columns = [
        {text: "Uid", key: "personUid"},
        {text: "Person ID", key: "personID"},
        {text: "Display Name", key: "displayName"},
    ] as Column[]

    if(props.type === 'Static') {
        columns.push(
            {text: "Last Changed", key: "lastChangedDate"},
            {text: "Actions", key: 'actions'}
        )
    }

    return columns
})

const members = ref<GroupMember[]>([])

const membersFormatted = computed<GroupMemberFormatted[]>(() => {
    return members.value.map(m => {
        return {
            uid: m.uid,
            personUid: m.person.uid,
            personID: m.person.personID,
            displayName: m.person.displayName,
            lastChangedDate: m.lastChangedDate
        }
    })
})

async function loadMembers() {
    members.value = await props.api.getGroupMembers(props.groupUid, search.value, sortDirection.value, sortBy.value)
}

async function addMember(personUid: string) {
    await props.api.addGroupMember(props.groupUid, personUid);
    await loadMembers()
}


async function removeMember(memberUid: string) {
    await props.api.removeGroupMember(props.groupUid, memberUid);
    await loadMembers()
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