<template>
    <div class="w-full ">
        <div class="flex justify-between gap-2 items-center hover:bg-slate-200 cursor-pointer" @click="handleHeaderClick">
            <div class=" w-max">{{ fieldSchema.name }}</div>
            <div v-if="isOpenable" class="w-4" >
                <ExpandLessIcon v-if="isOpen"/>
                <ExpandMoreIcon v-else/>
            </div>
        </div>
        <div class="pl-2" v-if="fieldSchema.fields && isOpen">
            <node-add-option :field-schema="subfield" @add-node.self="handleSubFieldAdded" v-for="subfield of fieldSchema.fields"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref, toRaw } from 'vue';
import { SchemaField, FilterNode, FilterNodeField, FilterNodeRelationalMany } from '../../types';
import { ExpandLessIcon, ExpandMoreIcon } from '@bcc-code/icons-vue';


const props = defineProps({
    fieldSchema: {type: Object as PropType<SchemaField>, required: true}

})

const isOpen = ref(false)

const emit = defineEmits<{
    addNode: [FilterNodeField | FilterNodeRelationalMany ]
}>()

const isOpenable = computed(() => {
    return props.fieldSchema.type === 'object' || props.fieldSchema.type === 'relational-many'
})

function handleHeaderClick() {
    if (isOpenable.value) {
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
    if(props.fieldSchema.type === 'object') {
        const nodeFieldCopy = structuredClone(toRaw(f))
        nodeFieldCopy.field = `${props.fieldSchema.key}.${f.field}`
        emit('addNode', nodeFieldCopy)
        return;
    }
    if(props.fieldSchema.type === 'relational-many') {
        const node:FilterNode = {
            type: 'relational-many',
            field: props.fieldSchema.key,
            nodes: [f],
            relType: 'some'
        }
        emit('addNode', node )
    }
}


</script>