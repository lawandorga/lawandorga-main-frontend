<template>
  <div class="flex">
    <h3>Angezeigte Informationen</h3>
    <Tooltip text="mind. eine Information muss ausgewählt sein">
      <InformationCircleIcon class="w-5 h-5" />
    </Tooltip>
  </div>
  <div class="flex flex-col">
    <span>
      <input id="subject" v-model="selectedFields.subject" type="checkbox" />
      <label for="subject">Betreff</label>
    </span>
    <span>
      <input id="sender" v-model="selectedFields.sender" type="checkbox" />
      <label for="sender">Absender:in(nen)</label>
    </span>
    <span>
      <input
        id="date"
        v-model="selectedFields.sending_datetime"
        type="checkbox"
      />
      <label for="date">Datum</label>
    </span>
  </div>
  <div class="flex">
    <h3>Sortierung</h3>
    <Tooltip text="Angepinnte Mails erscheinen immer ganz oben">
      <InformationCircleIcon class="w-5 h-5" />
    </Tooltip>
  </div>
  <div class="flex flex-col">
    <span>
      <input id="desc" v-model="sorting" type="radio" value="desc" />
      <label for="desc">Neueste Mails zuerst</label>
    </span>
    <span>
      <input id="asc" v-model="sorting" type="radio" value="asc" />
      <label for="asc">&Auml;lteste Mails zuerst</label>
    </span>
  </div>
  <div class="flex justify-end gap-3">
    <!-- TODO: Why isn't this a secondary button? -->
    <ButtonNormal type="secondary" @click="closeOverlay">
      <XMarkIcon class="w-6 h-6" />
      Schlie&szlig;en
    </ButtonNormal>
    <ButtonNormal type="primary" @click="saveSettings">
      <!-- TODO: Icon -->
      Speichern
    </ButtonNormal>
  </div>
</template>

<script setup lang="ts">
import Tooltip from "@/components/Tooltip.vue";
import { DisplayedFieldsObject, Sorting } from "@/types/mailImports";
import { ButtonNormal } from "lorga-ui";
import { ref, toRefs } from "vue";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";

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
  if (Object.keys(selectedFields.value).filter((key) => key).length === 0) {
    // TODO: show a message that at least one field needs to be selected
  }
  setShownFields.value(selectedFields.value);
  setSorting.value(sorting.value);
  closeOverlay.value();
};
</script>
