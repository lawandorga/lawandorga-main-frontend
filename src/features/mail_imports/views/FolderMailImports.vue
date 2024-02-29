<template>
  <div v-if="data">
    <BoxHeadingStats
      title="Mail-Imports"
      :show="selectedType === 'MAIL_IMPORTS'"
      :stats="[]"
    >
      <!-- TODO: add the search bar in the header -->
      <!-- TODO: add the email count -->
      <!-- TODO: add the button to copy an email address with -->
      <div
        class="grid grid-cols-[24px_24px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_24px] gap-2"
      >
        <input
          id="toggleAllEmails"
          class="col-start-1"
          type="checkbox"
          @input="toggleAllCheckedEmails"
        />
        <Tooltip text="ge&ouml;ffnet" class="col-start-2">
          <button @click="markAsRead">
            <EnvelopeOpenIcon class="w-5 h-5" />
          </button>
        </Tooltip>
        <span v-if="fieldsShown.subject" class="col-start-3">Betreff</span>
        <span v-if="fieldsShown.sender" class="col-start-4">
          Absender:in(nen)
        </span>
        <Tooltip class="col-start-6" text="Ansicht &auml;ndern">
          <button @click="settingsOpen = true">
            <AdjustmentsHorizontalIcon class="w-5 h-5" />
          </button>
        </Tooltip>
        <template v-for="mail in data" :key="mail.uuid">
          <input
            :checked="checkedEmails.includes(mail.uuid)"
            class="col-start-1"
            type="checkbox"
            @input="() => toggleCheckedEmail(mail.uuid)"
          />
          <!-- TODO: make the pin a button -->
          <!-- TODO: add pinning function including sending pin info to BE -->
          <StarSolidIcon v-if="mail.is_pinned" class="w-5 h-5 col-start-2" />
          <Tooltip
            v-if="!mail.is_pinned"
            text="E-Mail anpinnen"
            class="col-start-2"
          >
            <StarOutlineIcons class="w-5 h-5" />
          </Tooltip>
          <!-- TODO: sender semi-bold for unread emails -->
          <button
            :class="`contents ${mail.is_read ? '' : 'font-bold'}`"
            @click="() => toggleEmail(mail.uuid)"
          >
            <!-- TODO: figure out styling when subject and date are selected -->
            <template
              v-for="field in (
                Object.keys(fieldsShown) as PossibleDisplayedFields[]
              ).filter((key) => fieldsShown[key])"
              :key="field"
            >
              <!-- TODO: ellipsis for long subjects -->
              <span
                :class="`col-span-1 ${
                  field === 'sending_datetime' ? 'text-right' : 'text-left'
                }`"
              >
                {{ mail[field] }}
              </span>
            </template>
            <ChevronDownIcon
              v-if="!expandedEmails.includes(mail.uuid)"
              class="col-start-6 ml-auto"
            />
            <ChevronDownIcon
              v-if="expandedEmails.includes(mail.uuid)"
              class="col-start-6 ml-auto rotate-180"
            />
          </button>
          <!-- TODO: Add extras for the email content (sender etc) -->
          <div
            v-if="expandedEmails.includes(mail.uuid)"
            class="col-span-6 col-start-1"
          >
            {{ mail.content }}
          </div>
        </template>
      </div>
      <!-- TODO: width? -->
      <ModalFree
        v-model="settingsOpen"
        title="Ansicht der Mail-Imports einstellen"
        width="max-w-xl"
      >
        <SettingsOverlay
          :close-overlay="() => (settingsOpen = false)"
          :set-shown-fields="
            (newFields: DisplayedFieldsObject) => (fieldsShown = newFields)
          "
          :set-sorting="(newSorting: Sorting) => (sorting = newSorting)"
          :currently-shown-fields="fieldsShown"
          :current-sorting="sorting"
        />
      </ModalFree>
    </BoxHeadingStats>
  </div>
  <!-- TODO: is there an else? -->
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import useGet from "@/composables/useGet";
import {
  DisplayedFieldsObject,
  ImportedMail,
  PossibleDisplayedFields,
  Sorting,
} from "@/types/mailImports";
import { ModalFree } from "lorga-ui";
import { ref, toRefs } from "vue";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  EnvelopeOpenIcon,
  StarIcon as StarOutlineIcons,
} from "@heroicons/vue/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/vue/24/solid";
import SettingsOverlay from "../components/SettingsOverlay.vue";
import Tooltip from "@/components/Tooltip.vue";

// props
const props = defineProps<{
  folderUuid: string;
  selectedType: string;
}>();
const { folderUuid, selectedType } = toRefs(props);

const data = ref<ImportedMail[]>();
const client = useClient();
const request = client.get(
  "api/mail_imports/query/folder_mails/{}/",
  folderUuid,
);
useGet(request, data);

data.value?.sort((mail) => (mail.is_pinned ? -1 : 1)); // TODO: add sorting by time

const settingsOpen = ref<boolean>(false);
const sorting = ref<Sorting>("desc");
const fieldsShown = ref<DisplayedFieldsObject>({
  subject: true,
  sender: false,
  sending_datetime: false,
});

const checkedEmails = ref<string[]>([]);
const toggleCheckedEmail = (uuid: string) => {
  if (checkedEmails.value.includes(uuid)) {
    checkedEmails.value.splice(checkedEmails.value.indexOf(uuid), 1);
    (document.getElementById("toggleAllEmails") as HTMLInputElement).checked =
      false;
  } else {
    checkedEmails.value.push(uuid);
  }
};
const toggleAllCheckedEmails = (e: Event) => {
  if ((e.target as HTMLInputElement).checked) {
    checkedEmails.value = data.value?.map((mail) => mail.uuid) ?? [];
  } else {
    checkedEmails.value = [];
  }
};

const expandedEmails = ref<string[]>([]);
const toggleEmail = (uuid: string) => {
  if (expandedEmails.value.includes(uuid)) {
    expandedEmails.value.splice(expandedEmails.value.indexOf(uuid), 1);
  } else {
    expandedEmails.value.push(uuid);
    // TODO: send info that the email is read to BE, possibly update local state
  }
};

const markAsRead = () => {
  // TODO: mark checkedEmails as read
};
</script>
