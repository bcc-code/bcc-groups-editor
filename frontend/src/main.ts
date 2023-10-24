import { defineCustomElement } from "vue";
import groupEditVue from "./components/group-editor.ce.vue";

export const GroupEdit = defineCustomElement(groupEditVue);

customElements.define("group-editor", GroupEdit);
