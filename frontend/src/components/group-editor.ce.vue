<template>
    <group-edit v-if="editedGroup"  :api="api" :group="editedGroup" @close="editedGroup = null" />
    <groups-view v-else :api="api" @edit-group="editedGroup = $event" @add-group="editedGroup = getEmptyGroup()"/>
</template>

<script setup lang="ts">
import groupsView from './groups-view.vue';
import groupEdit from './group-edit.vue';
import {Group} from '../types'
import { ref } from 'vue';
import { Api } from '../api';

const props = defineProps({
    apiBaseUrl: {type: String, required: true}
})

const api = new Api(props.apiBaseUrl)


const editedGroup = ref<Group | null>(null)

function getEmptyGroup(): Group {
    return {
        uid: "",
        name: "",
        rule: "",
        tags: [],
        type: "Static",
        appUid: "",
        lastChangedDate: "",
    }
}


</script>

<style>
@import "@bcc-code/design-library-vue/tailwind/index.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

</style>
