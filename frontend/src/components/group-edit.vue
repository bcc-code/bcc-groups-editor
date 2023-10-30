<template>
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
            <BccButton :disabled="group.uid != '' && !isChanged" @click="saveGroup">Save</BccButton>
        </div>
    </div>
    <div class="grid grid-cols-1 gap-4">
        <BccInput disabled v-model="editedGroup.uid" label="Uid"/>
        <BccInput v-model="editedGroup.name" label="Name"/>
        <BccSelect v-model="editedGroup.type" label="Type">
            <option>Static</option>
            <option>Dynamic</option>
        </BccSelect>

        <div v-if="editedGroup.type == 'Dynamic'" class="w-full">
            <label class="bcc-form-label mb-2">Rule</label>
            <RuleInput v-model="editedGroup.rule" :schema="(ruleSchema as SchemaField[])"/>
        </div>

        <BccInput v-model="editedGroup.orgUid" label="Org Uid"/>
        <div class="w-full">
            <div class="flex justify-between items-center mb-2">
                <label class="bcc-form-label">Tags</label>
                <BccButton  size="xs" @click="editedGroup.tags.push('')" :icon="AddIcon"/>

            </div>
            <div v-for="(_, i) of editedGroup.tags" class="flex justify-between items-center mb-2">
                <BccInput class="flex-grow" v-model="editedGroup.tags[i]"/>
                <BccButton variant="tertiary" size="xs" :padding="false" @click="editedGroup.tags.splice(i, 1)" :icon="DeleteIcon"/>
            </div>
        </div>


        <BccInput disabled v-model="editedGroup.appUid" label="App Uid"/>
    </div>
</template>

<script setup lang="ts">
import { BccAlert, BccButton, BccInput, BccSelect } from '@bcc-code/design-library-vue';
import RuleInput from './filter/interface.vue'
import { AddIcon, DeleteIcon } from '@bcc-code/icons-vue';
import { PropType, computed, ref } from 'vue';
import ruleSchema from '../schema.json'

import {Group, SchemaField} from '../types'
import { Api } from '../api';

const props = defineProps({
    group: {type: Object as PropType<Group>, default: null},
    api: {type: Object as PropType<Api>, required: true}
})

const editedGroup = ref<Group>(JSON.parse(JSON.stringify(props.group)))

const isChanged = computed(() => {
    return JSON.stringify(props.group) != JSON.stringify(editedGroup.value)
})

const errorSaving = ref("")

async function saveGroup() {
    try {

        await props.api.saveGroup(editedGroup.value)
        emit('close')
    } catch(err) {
        if(!(err instanceof Error))
            throw err
        errorSaving.value = err.message 
    }
}


async function deleteGroup() {
    try {
        await props.api.deleteGroup(props.group.uid)
        emit('close')
    } catch(err) {
        if(!(err instanceof Error))
            throw err
        errorSaving.value = err.message 
    }
}


const emit = defineEmits(['close'])


</script>