<template>
  <div class="flex gap-2 mb-3 font-semibold text-zinc-500">
    <h3>Shown Information Fields</h3>
    <ToolTip
      text="At least one information field must be selected"
      tool-tip-id="at-least-one-field"
    >
      <InformationCircleIcon class="w-5 h-5" />
    </ToolTip>
  </div>
  <div class="flex flex-col gap-3">
    <span class="flex gap-2">
      <input id="subject" v-model="selectedFields.subject" type="checkbox" />
      <label for="subject">Subject</label>
    </span>
    <span class="flex gap-2">
      <input id="sender" v-model="selectedFields.sender" type="checkbox" />
      <label for="sender">Sender(s)</label>
    </span>
    <span class="flex gap-2">
      <input
        id="date"
        v-model="selectedFields.sending_datetime"
        type="checkbox"
      />
      <label for="date">Date</label>
    </span>
  </div>
  <div class="flex gap-2 mt-4 mb-3 font-semibold text-zinc-500">
    <h3>Sorting</h3>
    <ToolTip text="Pinned mails are always shown at the top">
      <InformationCircleIcon class="w-5 h-5" />
    </ToolTip>
  </div>
  <div class="flex flex-col gap-3">
    <span class="flex gap-2">
      <input id="desc" v-model="sorting" type="radio" value="desc" />
      <label for="desc">Newest mails first</label>
    </span>
    <span class="flex gap-2">
      <input id="asc" v-model="sorting" type="radio" value="asc" />
      <label for="asc">Oldest mails first</label>
    </span>
  </div>
  <div class="flex justify-end gap-3">
    <ButtonNormal kind="secondary" @click="closeOverlay">
      <XMarkIcon class="w-6 h-6 mr-2" />
      <span class="pr-1">Close</span>
    </ButtonNormal>
    <ButtonNormal kind="primary" @click="saveSettings">
      <CheckCircleIcon class="w-6 h-6 mr-2" />
      <span class="pr-1">Save</span>
    </ButtonNormal>
  </div>
</template>

<script setup lang="ts">
import ToolTip from "@/components/ToolTip.vue";
import {
  DisplayedFieldsObject,
  PossibleDisplayedFields,
  Sorting,
} from "@/types/mailImports";
import { ButtonNormal } from "lorga-ui";
import { ref, toRefs } from "vue";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

// props
const props = defineProps<{
  closeOverlay: () => void;
  currentlyShownFields: DisplayedFieldsObject;
  currentSorting: Sorting;
  // eslint-disable-next-line no-unused-vars
  setShownFields: (newFields: DisplayedFieldsObject) => void;
  // eslint-disable-next-line no-unused-vars
  setSorting: (newSorting: Sorting) => void;
}>();
const {
  closeOverlay,
  currentlyShownFields,
  currentSorting,
  setShownFields,
  setSorting,
} = toRefs(props);

const selectedFields = ref({ ...currentlyShownFields.value });
const sorting = ref<Sorting>(currentSorting.value);

const saveSettings = () => {
  const selectedFieldsCount = (
    Object.keys(selectedFields.value) as PossibleDisplayedFields[]
  ).filter((key) => selectedFields.value[key]).length;

  if (selectedFieldsCount === 0) {
    const atLeastOneFieldTooltip = document.getElementById(
      "at-least-one-field",
    ) as HTMLElement;
    atLeastOneFieldTooltip.style.visibility = "visible";
    return;
  }

  setShownFields.value(selectedFields.value);
  setSorting.value(sorting.value);
  closeOverlay.value();
};
</script>
