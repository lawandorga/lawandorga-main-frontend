<script setup lang="ts">
import { debounce } from "lodash";
import { ButtonNormal } from "lorga-ui";
import { onBeforeUnmount, onMounted, ref, toRefs, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

import FormTipTapTwo from "@/components/FormTipTapTwo.vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  text: string;
  collabUuid: string;
}>();

const { text, collabUuid } = toRefs(props);

const model = ref<string>(text.value);
const savedText = ref<string>(text.value);
const status = ref<string>("Saved");

const { commandRequest } = useCmd();

const autosave = debounce(() => save(), 5000);

async function save(): Promise<boolean> {
  autosave.cancel();
  const textToSave = model.value;
  if (textToSave === savedText.value) {
    status.value = "Saved";
    return true;
  }
  status.value = "Saving...";
  try {
    await commandRequest({
      action: "collab/sync_collab",
      collab_uuid: collabUuid.value,
      text: textToSave,
    });
    savedText.value = textToSave;
    status.value = model.value === textToSave ? "Saved" : "Unsaved changes";
    return true;
  } catch {
    status.value = "Not saved";
    return false;
  }
}

watch(model, () => {
  status.value = "Unsaved changes";
  autosave();
});

const canLeave = async () =>
  (await save()) ||
  window.confirm("Your changes could not be saved. Leave anyway?");

onBeforeRouteUpdate(
  (to) => to.query.selectedId === collabUuid.value || canLeave(),
);
onBeforeRouteLeave(canLeave);

const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
  if (model.value !== savedText.value) event.preventDefault();
};

onMounted(() =>
  window.addEventListener("beforeunload", warnAboutUnsavedChanges),
);
onBeforeUnmount(() => {
  autosave.flush();
  window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
});
</script>

<template>
  <div @keydown.ctrl.s.prevent="save" @keydown.meta.s.prevent="save">
    <FormTipTapTwo v-model="model">
      <div class="flex items-center justify-between px-2 py-1.5 print:hidden">
        <span
          role="status"
          class="text-xs font-medium text-gray-700 uppercase"
          data-test="collab-status"
        >
          {{ status }}
        </span>
        <ButtonNormal
          kind="action"
          :disabled="status === 'Saved' || status === 'Saving...'"
          data-test="collab-save"
          @click="save"
        >
          Save
        </ButtonNormal>
      </div>
    </FormTipTapTwo>
  </div>
</template>
