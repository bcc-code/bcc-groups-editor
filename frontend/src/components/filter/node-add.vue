<template>
    <!-- <VueMultiselect
      v-model="val"
      :options="['Banana', 'Apple', 'gg']">
    </VueMultiselect> -->
    <Dropdown v-slot="{close}">
        <div class="hover:bg-slate-200 cursor-pointer" @click="console.log(key); close()" v-for="key of Object.keys(schema)">{{key}}</div>
    </Dropdown>
    <!-- <BccSelect size="sm" :key="key" modelValue="" @update:model-value="add" placeholder="Add filter">
        <option value="" disabled>Add a filter</option>
        <option value="logical">And/Or group</option>
        <FieldOptions :schema="schema"/>
    </BccSelect> -->
</template>

<script setup lang="ts">
// import VueMultiselect from 'vue-multiselect'

import { PropType, ref } from 'vue';
import { FilterNode, Schema } from '../../types';
// import FieldOptions from './field-options.vue';
// import { BccSelect } from '@bcc-code/design-library-vue';
import Dropdown from '../dropdown.vue';

defineProps({
    schema: {
        type: Object as PropType<Schema>,
        required: true
    }
})

// const val = ref("")

// function add(v: string) {
//     // if(!(e.target instanceof HTMLSelectElement)) return

//     if(v == 'logical') {
//         emit('addNode', {
//             type: 'logical',
//             operator: 'and',
//             nodes: []
//         } )
//     }
//     else {
//         emit('addNode', {
//             type: 'field',
//             field: v,
//             operator: '_eq',
//             value: null
//         })
//     }
//     key.value++
// }

const emit = defineEmits<{
    addNode: [FilterNode]
}>()

</script>
