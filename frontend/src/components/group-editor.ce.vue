<template>
    <div v-if="api">
        <group-edit v-if="editedGroup"  :api="api" :group="editedGroup" @close="editedGroup = null" />
        <groups-view v-else :api="api" @edit-group="editedGroup = $event" @add-group="editedGroup = getEmptyGroup()"/>
    </div>
</template>

<script setup lang="ts">
import groupsView from './groups-view.vue';
import groupEdit from './group-edit.vue';
import {Group} from '../types'
import { ref, watchEffect } from 'vue';
import { Api, TokenSource, StaticTokenSource, UrlTokenSource, getEmptyGroup } from '../api';

const props = defineProps({
    apiBaseUrl: {type: String, required: true},
    accessToken: {type: String, default: ''},
    accessTokenEndpoint: {type: String, default: ''},
})

const api = ref<Api>()

watchEffect(() => {
    api.value = createApi()
})

function createApi(): Api {
    let tokenSource: TokenSource | undefined;
    if(props.accessToken) 
        tokenSource = new StaticTokenSource(props.accessToken)

    else if(props.accessTokenEndpoint) 
        tokenSource = new UrlTokenSource(props.accessTokenEndpoint)

    return new Api(props.apiBaseUrl, tokenSource)

}

const editedGroup = ref<Group | null>(getEmptyGroup())
</script>

<style>
@import "@bcc-code/design-library-vue/tailwind/index.css";
@import "vue-multiselect/dist/vue-multiselect.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

</style>
