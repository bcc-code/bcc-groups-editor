<template>
    <div  v-if="loaded">
        <BccAlert
            title="Error saving group!"
            icon
            closeButton
            context="danger"
            :open="errorSaving != ''"
            @close="errorSaving = ''"
            >
            {{errorSaving}}
            </BccAlert>
        <div class="flex justify-between mb-4">
            <BccButton variant="tertiary" :padding="false" @click="$emit('close')">Back</BccButton>
            <div class="flex gap-4">
                <BccButton v-if="group.uid" context="danger" @click="deleteGroup">Delete</BccButton>
                <BccButton @click="saveGroup">Save</BccButton>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-4">
            <BccInput disabled v-model="group.uid" label="Uid"/>
            <BccInput v-model="group.name" label="Name"/>
            <BccSelect v-model="group.type" label="Type">
                <option>Static</option>
                <option>Dynamic</option>
            </BccSelect>

            <div v-if="group.type == 'Dynamic'" class="w-full">
                <label class="bcc-form-label mb-2">Rule</label>
                <RuleInput v-model="group.rule" :schema="(schema)"/>
            </div>

            <BccInput v-model="group.orgUid" label="Org Uid"/>
            <div class="w-full">
                <div class="flex justify-between items-center mb-2">
                    <label class="bcc-form-label">Tags</label>
                    <BccButton  size="xs" @click="group.tags.push('')" :icon="AddIcon"/>

                </div>
                <div v-for="(_, i) of group.tags" class="flex justify-between items-center mb-2">
                    <BccInput class="flex-grow" v-model="group.tags[i]"/>
                    <BccButton variant="tertiary" size="xs" :padding="false" @click="group.tags.splice(i, 1)" :icon="DeleteIcon"/>
                </div>
            </div>
            <BccInput disabled v-model="group.appUid" label="App Uid"/>
            <GroupMembers :api="api" :group="group" :key="groupKey"/>
        </div>

    </div>
</template>

<script setup lang="ts">
import { BccAlert, BccButton, BccInput, BccSelect } from '@bcc-code/design-library-vue';
import RuleInput from './filter/interface.vue'
import { AddIcon, DeleteIcon } from '@bcc-code/icons-vue';
import { PropType, ref, watchEffect } from 'vue';

import {Group} from '../types'
import { Api, getEmptyGroup } from '../api';
import { getPersonSchema } from '../schema';
import GroupMembers from './group-members.vue';

const props = defineProps({
    groupUid: {type: String},
    api: {type: Object as PropType<Api>, required: true}
})

const schema = getPersonSchema()

const loaded= ref(false)
const group = ref<Group>(getEmptyGroup())

watchEffect(async() => {
    if(!props.groupUid) {
        group.value = getEmptyGroup();
    } else {
        group.value = await  props.api.getGroup(props.groupUid)

    }
    loaded.value = true
})


const errorSaving = ref("")

const groupKey = ref(0)

async function saveGroup() {
    try {
        await props.api.saveGroup(group.value)
    } catch(err) {
        if(!(err instanceof Error))
            throw err
        errorSaving.value = err.message 
    }
}

async function deleteGroup() {
    if(!props.groupUid) return;
    try {
        await props.api.deleteGroup(props.groupUid)
        emit('close')
    } catch(err) {
        if(!(err instanceof Error))
            throw err
        errorSaving.value = err.message 
    }
}

const emit = defineEmits(['close'])


</script>