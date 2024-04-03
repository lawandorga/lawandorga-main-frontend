<template>
  <div v-if="mails">
    <BoxHeadingStats
      title="Mail Imports"
      :show="selectedType === 'MAIL_IMPORTS'"
      :stats="[mails.length === 1 ? '1 mail' : `${mails.length} mails`]"
    >
      <template #buttons>
        <div class="flex items-center gap-4">
          <CopyCCAdressFromFolder
            :address="`${folderUuid}@folders.law-orga.de`"
          />
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search in mails"
            class="p-3 rounded-full bg-neutral-100"
            @input="search"
          />
          <MagnifyingGlassIcon
            class="absolute w-5 h-5 right-3 top-3.5 pointer-events-none"
          />
        </div>
      </template>
      <ButtonNormal class="mb-4" @click="importMails">
        Import new mails
      </ButtonNormal>
      <div
        class="grid grid-cols-[24px_24px_1fr_max-content_max-content_24px] gap-2"
      >
        <input
          id="toggleAllMails"
          class="self-center w-4 h-4 col-start-1 justify-self-center"
          type="checkbox"
          @input="toggleAllCheckedMails"
        />
        <ToolTip
          v-if="checkedMails.length !== 0 && areAllCheckedEmailsRead()"
          text="Mark as unread"
          class="col-start-2"
        >
          <button @click="() => markAsUnread(checkedMails)">
            <EnvelopeIcon class="w-5 h-5" />
          </button>
        </ToolTip>
        <ToolTip v-else text="Mark as read" class="col-start-2">
          <button @click="() => markAsRead(checkedMails)">
            <EnvelopeOpenIcon class="w-5 h-5" />
          </button>
        </ToolTip>
        <span
          v-if="fieldsShown.subject"
          class="col-span-1 font-semibold text-neutral-600"
        >
          Subject
        </span>
        <span
          v-if="fieldsShown.sender"
          class="col-span-1 font-semibold text-neutral-600"
        >
          Sender(s)
        </span>
        <ToolTip class="col-start-6" text="Edit display">
          <button @click="settingsOpen = true">
            <AdjustmentsHorizontalIcon class="w-5 h-5" />
          </button>
        </ToolTip>
        <div class="w-auto h-px col-span-6 col-start-1 bg-neutral-300" />
        <template
          v-for="(mail, index) in searchResults || sortedMails"
          :key="mail.uuid"
        >
          <input
            :checked="checkedMails.includes(mail.uuid)"
            class="self-center w-4 h-4 col-start-1 justify-self-center"
            type="checkbox"
            @input="() => toggleCheckedMail(mail.uuid)"
          />
          <button
            class="col-start-2"
            @click="() => toggleMailPinned(mail.uuid)"
          >
            <StarSolidIcon v-if="mail.is_pinned" class="w-5 h-5 col-start-2" />
            <ToolTip v-if="!mail.is_pinned" text="E-Mail anpinnen">
              <StarOutlineIcons class="w-5 h-5" />
            </ToolTip>
          </button>
          <button class="contents" @click="() => toggleMailExpanded(mail.uuid)">
            <span
              v-if="fieldsShown.subject"
              :class="`col-span-1 overflow-hidden text-left whitespace-nowrap text-ellipsis ${
                mail.is_read ? '' : 'font-bold'
              }`"
            >
              {{ mail.subject }}
            </span>
            <span
              v-if="fieldsShown.sender"
              :class="`col-span-1 text-left ${
                mail.is_read ? '' : 'font-semibold'
              }`"
            >
              {{ mail.sender }}
            </span>
            <span
              v-if="fieldsShown.sending_datetime"
              :class="`col-start-5 text-right  ${
                mail.is_read ? '' : 'font-semibold'
              }`"
            >
              {{ formatDate(mail.sending_datetime) }}
            </span>
            <ChevronDownIcon
              v-if="!expandedMails.includes(mail.uuid)"
              class="col-start-6 ml-auto"
            />
            <ChevronDownIcon
              v-if="expandedMails.includes(mail.uuid)"
              class="col-start-6 ml-auto rotate-180"
            />
          </button>
          <MailContent v-if="expandedMails.includes(mail.uuid)" :mail="mail" />
          <div
            v-if="index !== mails.length - 1"
            class="w-auto h-px col-span-6 col-start-1 bg-neutral-300"
          />
        </template>
        <div
          v-if="searchQuery.length > 0 && searchResults?.length === 0"
          class="col-span-5"
        >
          No results for this search query
        </div>
      </div>
      <ModalFree
        v-model="settingsOpen"
        title="Edit the display of the mail imports"
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
</template>

<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import {
  DisplayedFieldsObject,
  ImportedMail,
  Sorting,
} from "@/types/mailImports";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { ref, toRefs, computed } from "vue";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon,
  StarIcon as StarOutlineIcons,
} from "@heroicons/vue/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/vue/24/solid";
import CopyCCAdressFromFolder from "../actions/CopyCCAdressFromFolder.vue";
import MailContent from "../components/MailContent.vue";
import SettingsOverlay from "../components/SettingsOverlay.vue";
import ToolTip from "@/components/ToolTip.vue";
import useCmd from "@/composables/useCmd";

// props
const props = defineProps<{
  folderUuid: string;
  selectedType: string;
  mails?: ImportedMail[];
  query: () => void;
}>();
const { folderUuid, selectedType, mails, query } = toRefs(props);

const searchQuery = ref<string>("");
const searchResults = ref<ImportedMail[]>();
const search = () => {
  searchResults.value = mails.value?.filter(
    (mail) =>
      mail.subject.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mail.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mail.sender.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      mail.cc.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
};

const importMails = () => {
  const { commandRequest } = useCmd(query);
  commandRequest({
    action: "mail_imports/import_mails",
  });
};

const settingsOpen = ref<boolean>(false);
const sorting = ref<Sorting>("desc");
const fieldsShown = ref<DisplayedFieldsObject>({
  subject: true,
  sender: false,
  sending_datetime: true,
});

const sortedMails = computed(() => {
  if (!mails.value) return [];
  return [...mails.value]
    .sort((mail, previousMail) => {
      if (sorting.value === "asc") {
        return mail.sending_datetime < previousMail.sending_datetime ? 1 : -1;
      } else {
        return mail.sending_datetime < previousMail.sending_datetime ? -1 : 1;
      }
    })
    .sort((mail) => (mail.is_read ? -1 : 1))
    .sort((mail) => (mail.is_pinned ? -1 : 1));
});

const checkedMails = ref<string[]>([]);
const toggleCheckedMail = (uuid: string) => {
  if (checkedMails.value.includes(uuid)) {
    checkedMails.value.splice(checkedMails.value.indexOf(uuid), 1);
    (document.getElementById("toggleAllMails") as HTMLInputElement).checked =
      false;
  } else {
    checkedMails.value.push(uuid);
  }
};
const toggleAllCheckedMails = (e: Event) => {
  if ((e.target as HTMLInputElement).checked) {
    checkedMails.value = mails.value?.map((mail) => mail.uuid) ?? [];
  } else {
    checkedMails.value = [];
  }
};

const expandedMails = ref<string[]>([]);
const toggleMailExpanded = (uuid: string) => {
  if (expandedMails.value.includes(uuid)) {
    expandedMails.value.splice(expandedMails.value.indexOf(uuid), 1);
  } else {
    expandedMails.value.push(uuid);
    if (!mails.value?.find((mail) => mail.uuid === uuid)?.is_read) {
      const { commandRequest } = useCmd(query);
      commandRequest({
        action: "mail_imports/mark_mails_as_read",
        mail_uuids: [uuid],
      });
    }
  }
};

const areAllCheckedEmailsRead = () =>
  mails.value?.filter(
    (mail) => checkedMails.value.includes(mail.uuid) && !mail.is_read,
  ).length === 0;

const markAsUnread = (uuids: string[]) => {
  const { commandRequest } = useCmd(query);
  commandRequest({
    action: "mail_imports/mark_mails_as_unread",
    mail_uuids: uuids,
  });
  checkedMails.value = [];
  (document.getElementById("toggleAllMails") as HTMLInputElement).checked =
    false;
};

const markAsRead = (uuids: string[]) => {
  const { commandRequest } = useCmd(query);
  commandRequest({
    action: "mail_imports/mark_mails_as_read",
    mail_uuids: uuids,
  });
  checkedMails.value = [];
  (document.getElementById("toggleAllMails") as HTMLInputElement).checked =
    false;
};

const toggleMailPinned = (uuid: string) => {
  const { commandRequest } = useCmd(query);
  commandRequest({
    action: "mail_imports/toggle_mail_pinned",
    mail_uuid: uuid,
  });
};

const dateFormatWithYear: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
  year: "2-digit",
};
const dateFormatWithoutYear: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "long",
};
const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString(
    "de-DE",
    new Date(date).getFullYear() !== new Date().getFullYear()
      ? dateFormatWithYear
      : dateFormatWithoutYear,
  );
</script>
