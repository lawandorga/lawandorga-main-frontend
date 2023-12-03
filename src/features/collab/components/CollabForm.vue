<script setup lang="ts">
import FormTipTapTwo from "@/components/FormTipTapTwo.vue";
import { ref, toRefs, watch } from "vue";
import { debounce } from "lodash";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  text: string;
  collabUuid: string;
  password: string;
}>();

const { text, collabUuid } = toRefs(props);

const model = ref<string>(text.value);

const { commandRequest } = useCmd();

const status = ref<string>("Synced");

const save = debounce(() => {
  commandRequest({
    action: "collab/sync_collab",
    collab_uuid: collabUuid.value,
    text: model.value,
  });
  status.value = "Synced";
}, 5000);

watch(model, (newValue) => {
  if (newValue !== text.value) {
    status.value = "Saving...";
    save();
  }
});
</script>

<template>
  <div>
    <FormTipTapTwo v-model="model" :room="collabUuid" :password="password">
      <div
        class="px-2 py-1.5 text-xs font-medium text-gray-700 uppercase print:hidden"
      >
        {{ status }}
      </div>
    </FormTipTapTwo>
  </div>
</template>
