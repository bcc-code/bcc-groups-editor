<template>
    <!-- <VueMultiselect
      v-model="val"
      :options="['Banana', 'Apple', 'gg']">
    </VueMultiselect> -->

    <Dropdown>
        <template v-slot:header="{isOpen}">
            <div class="flex w-full items-center cursor-pointer">
                <p class="w-max">Add a filter</p>
                <div class="w-5">
                    <ExpandMoreIcon v-if="!isOpen" />
                    <ExpandLessIcon v-else />
                </div>
            </div>
        </template>
        <template  v-slot="{close}">
            <div class="hover:bg-slate-200 cursor-pointer" @click="addLogicalGroup(); close()">
                And/Or Group
            </div>
            <NodeAddOption :field-schema="field" @add-node="emit('addNode', $event); close()" v-for="field of schema"/>
        </template>
    </Dropdown>
    <!-- <BccSelect size="sm" :key="key" modelValue="" @update:model-value="add" placeholder="Add filter">
        <option value="" disabled>Add a filter</option>
        <option value="logical">And/Or group</option>
        <FieldOptions :schema="schema"/>
    </BccSelect> -->
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { FilterNode, SchemaField } from '../../types';
// import FieldOptions from './field-options.vue';
// import { BccSelect } from '@bcc-code/design-library-vue';
import Dropdown from '../dropdown.vue';
import { ExpandLessIcon, ExpandMoreIcon } from '@bcc-code/icons-vue';
import NodeAddOption from './node-add-option.vue';

defineProps({
    schema: {
        type: Object as PropType<SchemaField[]>,
        required: true
    }
})

function addLogicalGroup() {
    emit('addNode', {
        type: 'logical',
        operator: 'and',
        nodes: []
    })
}


const emit = defineEmits<{
    addNode: [FilterNode]
}>()

</script>
