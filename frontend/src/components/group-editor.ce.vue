<template>
    <div v-if="api">
        <group-edit v-if="editedGroup || addingGroup"  :api="api" :group-uid="editedGroup" @close="stopGroupEdit()" />
        <groups-view v-else :api="api" @edit-group="editedGroup = $event" @add-group="addingGroup = true"/>
    </div>
</template>

<script setup lang="ts">
import groupsView from './groups-view.vue';
import groupEdit from './group-edit.vue';
import { ref, watchEffect } from 'vue';
import { Api, TokenSource, StaticTokenSource, UrlTokenSource } from '../api';

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

const editedGroup = ref<string>()
const addingGroup = ref(false)

function stopGroupEdit() {
    editedGroup.value = undefined;
    addingGroup.value = false;
}
</script>

<style>
@import "@bcc-code/design-library-vue/tailwind/index.css";
@import "vue-multiselect/dist/vue-multiselect.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

</style>
