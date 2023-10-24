<template>
    <div class="flex justify-between mb-4">
        <BccButton variant="tertiary" :padding="false" @click="$emit('close')">Back</BccButton>
        <BccButton @click="save" :disabled="!isChanged">Save</BccButton>
    </div>
    <div class="grid grid-cols-1 gap-4">
        <BccInput disabled v-model="editedGroup.uid" label="Uid"/>
        <BccInput v-model="editedGroup.name" label="Name"/>
        <BccSelect v-model="editedGroup.type" label="Type">
            <option>Static</option>
            <option>Dynamic</option>
        </BccSelect>
        <BccInput v-if="editedGroup.type == 'Dynamic'" v-model="editedGroup.rule" label="Rule"/>

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
import { BccButton, BccInput, BccSelect } from '@bcc-code/design-library-vue';
import { AddIcon, DeleteIcon } from '@bcc-code/icons-vue';
import { PropType, computed, ref } from 'vue';

import {Group} from '../types'
import { Api } from '../api';

const props = defineProps({
    group: {type: Object as PropType<Group>, default: null},
    api: {type: Object as PropType<Api>, required: true}
})

const editedGroup = ref<Group>(JSON.parse(JSON.stringify(props.group)))

const isChanged = computed(() => {
    return JSON.stringify(props.group) != JSON.stringify(editedGroup.value)
})


async function save() {
    await props.api.saveGroup(editedGroup.value)
    emit('close')
}

const emit = defineEmits(['close'])


</script>