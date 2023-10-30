<template>
    <div class="w-full ">
        <div class="flex justify-between gap-2 items-center hover:bg-slate-200 cursor-pointer" @click="handleHeaderClick">
            <div class=" w-max">{{ fieldSchema.name }}</div>
            <div v-if="fieldSchema.type === 'object'" class="w-4" >
                <ExpandLessIcon v-if="isOpen"/>
                <ExpandMoreIcon v-else/>
            </div>
        </div>
        <div class="pl-2" v-if="fieldSchema.fields && isOpen">
            <node-add-option :field-schema="subfield" @add-node="handleSubFieldAdded" v-for="subfield of fieldSchema.fields"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { SchemaField, FilterNodeField, FilterNodeRelationalMany } from '../../types';
import { ExpandLessIcon, ExpandMoreIcon } from '@bcc-code/icons-vue';


const props = defineProps({
    fieldSchema: {type: Object as PropType<SchemaField>, required: true}

})

const isOpen = ref(false)

const emit = defineEmits<{
    addNode: [FilterNodeField | FilterNodeRelationalMany ]
}>()

function handleHeaderClick() {
    if (props.fieldSchema.type === 'object') {
       isOpen.value = !isOpen.value
       return;
    }
    emit('addNode', {
        type: 'field',
        field: props.fieldSchema.key,
        operator: '_eq',
        value: null
    })
}

function handleSubFieldAdded(f: FilterNodeField | FilterNodeRelationalMany) {
    f.field = `${props.fieldSchema.key}.${f.field}`
    emit('addNode', f)
}


</script>