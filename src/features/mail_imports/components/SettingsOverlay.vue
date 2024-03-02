<template>
  <div class="flex gap-2 mb-3 font-semibold text-zinc-500">
    <h3>Angezeigte Informationen</h3>
    <ToolTip
      text="mind. eine Information muss ausgewählt sein"
      tool-tip-id="at-least-one-setting"
    >
      <InformationCircleIcon class="w-5 h-5" />
    </ToolTip>
  </div>
  <div class="flex flex-col gap-3">
    <span class="flex gap-2">
      <input id="subject" v-model="selectedFields.subject" type="checkbox" />
      <label for="subject">Betreff</label>
    </span>
    <span class="flex gap-2">
      <input id="sender" v-model="selectedFields.sender" type="checkbox" />
      <label for="sender">Absender:in(nen)</label>
    </span>
    <span class="flex gap-2">
      <input
        id="date"
        v-model="selectedFields.sending_datetime"
        type="checkbox"
      />
      <label for="date">Datum</label>
    </span>
  </div>
  <div class="flex gap-2 mt-4 mb-3 font-semibold text-zinc-500">
    <h3>Sortierung</h3>
    <ToolTip text="Angepinnte Mails erscheinen immer ganz oben">
      <InformationCircleIcon class="w-5 h-5" />
    </ToolTip>
  </div>
  <div class="flex flex-col gap-3">
    <span class="flex gap-2">
      <input id="desc" v-model="sorting" type="radio" value="desc" />
      <label for="desc">Neueste Mails zuerst</label>
    </span>
    <span class="flex gap-2">
      <input id="asc" v-model="sorting" type="radio" value="asc" />
      <label for="asc">&Auml;lteste Mails zuerst</label>
    </span>
  </div>
  <div class="flex justify-end gap-3">
    <!-- TODO: Why isn't this a secondary button? -->
    <ButtonNormal type="secondary" @click="closeOverlay">
      <XMarkIcon class="w-6 h-6 mr-2" />
      <span class="pr-1">Schlie&szlig;en</span>
    </ButtonNormal>
    <ButtonNormal type="primary" @click="saveSettings">
      <CheckCircleIcon class="w-6 h-6 mr-2" />
      <span class="pr-1">Speichern</span>
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
  const selectedSettingsCount = (
    Object.keys(selectedFields.value) as PossibleDisplayedFields[]
  ).filter((key) => selectedFields.value[key]).length;

  if (selectedSettingsCount === 0) {
    const atLeastOneSettingTooltip = document.getElementById(
      "at-least-one-setting",
    ) as HTMLElement;
    atLeastOneSettingTooltip.style.visibility = "visible";
    return;
  }

  setShownFields.value(selectedFields.value);
  setSorting.value(sorting.value);
  closeOverlay.value();
};
</script>
