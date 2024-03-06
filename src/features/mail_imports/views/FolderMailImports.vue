<template>
  <div v-if="mails">
    <BoxHeadingStats
      title="Mail-Imports"
      :show="selectedType === 'MAIL_IMPORTS'"
      :stats="[`${mails.length} Mails insgesamt`]"
    >
      <template #buttons>
        <div class="flex items-center gap-4">
          <ButtonNormal kind="action" @click="copyMailAddress">
            Mail-Adresse kopieren
          </ButtonNormal>
          <input
            v-model="query"
            type="search"
            placeholder="In Mails suchen"
            class="p-3 rounded-full bg-neutral-100"
            @input="search"
          />
          <MagnifyingGlassIcon
            class="absolute w-5 h-5 right-3 top-3.5 pointer-events-none"
          />
        </div>
      </template>
      <div
        class="grid grid-cols-[24px_24px_1fr_max-content_max-content_24px] gap-2"
      >
        <input
          id="toggleAllEmails"
          class="self-center w-4 h-4 col-start-1 justify-self-center"
          type="checkbox"
          @input="toggleAllCheckedEmails"
        />
        <ToolTip text="ge&ouml;ffnet" class="col-start-2">
          <button @click="() => markAsRead(checkedEmails)">
            <EnvelopeOpenIcon class="w-5 h-5" />
          </button>
        </ToolTip>
        <span v-if="fieldsShown.subject" class="col-span-1">Betreff</span>
        <span v-if="fieldsShown.sender" class="col-span-1">
          Absender:in(nen)
        </span>
        <ToolTip class="col-start-6" text="Ansicht &auml;ndern">
          <button @click="settingsOpen = true">
            <AdjustmentsHorizontalIcon class="w-5 h-5" />
          </button>
        </ToolTip>
        <template
          v-for="mail in (query.length > 0 ? searchResults : mails)!
            .sort((mail, previousMail) => {
              if (sorting === 'asc') {
                return mail.sending_datetime < previousMail.sending_datetime
                  ? 1
                  : -1;
              } else {
                return mail.sending_datetime < previousMail.sending_datetime
                  ? -1
                  : 1;
              }
            })
            .sort((mail) => (mail.is_pinned ? -1 : 1))"
          :key="mail.uuid"
        >
          <div class="w-auto h-px col-span-6 col-start-1 bg-neutral-300" />
          <input
            :checked="checkedEmails.includes(mail.uuid)"
            class="self-center w-4 h-4 col-start-1 justify-self-center"
            type="checkbox"
            @input="() => toggleCheckedEmail(mail.uuid)"
          />
          <button class="col-start-2" @click="() => toggleEmailPin(mail.uuid)">
            <StarSolidIcon v-if="mail.is_pinned" class="w-5 h-5 col-start-2" />
            <ToolTip v-if="!mail.is_pinned" text="E-Mail anpinnen">
              <StarOutlineIcons class="w-5 h-5" />
            </ToolTip>
          </button>
          <button class="contents" @click="() => toggleEmail(mail.uuid)">
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
              {{
                new Date(mail.sending_datetime).toLocaleDateString(
                  "de-DE",
                  new Date(mail.sending_datetime).getFullYear() !==
                    new Date().getFullYear()
                    ? dateFormatWithYear
                    : dateFormatWithoutYear,
                )
              }}
            </span>
            <ChevronDownIcon
              v-if="!expandedEmails.includes(mail.uuid)"
              class="col-start-6 ml-auto"
            />
            <ChevronDownIcon
              v-if="expandedEmails.includes(mail.uuid)"
              class="col-start-6 ml-auto rotate-180"
            />
          </button>
          <div
            v-if="expandedEmails.includes(mail.uuid)"
            class="flex flex-col col-span-5 col-start-2 gap-2 mb-4 text-sm"
          >
            <div class="text-neutral-500">von {{ mail.sender }}</div>
            <div class="text-neutral-500">an {{ mail.bcc }}</div>
            <div class="mt-3">{{ mail.content }}</div>
          </div>
        </template>
        <div
          v-if="query.length > 0 && searchResults?.length === 0"
          class="col-span-5"
        >
          Keine Ergebnisse f&uuml;r diese Suchanfrage
        </div>
      </div>
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
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import useGet from "@/composables/useGet";
import {
  DisplayedFieldsObject,
  ImportedMail,
  Sorting,
} from "@/types/mailImports";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { ref, toRefs } from "vue";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  EnvelopeOpenIcon,
  MagnifyingGlassIcon,
  StarIcon as StarOutlineIcons,
} from "@heroicons/vue/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/vue/24/solid";
import SettingsOverlay from "../components/SettingsOverlay.vue";
import ToolTip from "@/components/ToolTip.vue";

// props
const props = defineProps<{
  folderUuid: string;
  selectedType: string;
}>();
const { folderUuid, selectedType } = toRefs(props);

const mails = ref<ImportedMail[]>();
const client = useClient();
const request = client.get(
  "api/mail_imports/query/folder_mails/{}/",
  folderUuid,
);
useGet(request, mails);
const query = ref<string>("");
const searchResults = ref<ImportedMail[]>();
const search = () => {
  searchResults.value = mails.value?.filter(
    (mail) =>
      mail.subject.toLowerCase().includes(query.value) ||
      mail.content.toLowerCase().includes(query.value) ||
      mail.sender.toLowerCase().includes(query.value) ||
      mail.bcc.toLowerCase().includes(query.value),
  );
};

const mailAddressToBeCopied = "toBeDone@web.de"; // TODO: get the real one
const copyMailAddress = () => {
  navigator.clipboard.writeText(mailAddressToBeCopied);
};

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
    checkedEmails.value = mails.value?.map((mail) => mail.uuid) ?? [];
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

    // The UUID comes from the list of emails, so it is in the list
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const currentEmail = mails.value?.find((email) => email.uuid === uuid)!;
    currentEmail.is_read = true;
    // TODO: send info that the email is read to BE
    const client = useClient();
    const request = client.post(
      "api/mail_imports/mark_emails_as_read/{}/",
      uuid,
    );
    request().then((res) => console.log(res));
  }
};

const markAsRead = (uuids: string[]) => {
  uuids.forEach((uuid) => {
    // The UUID comes from the list of emails, so it is in the list
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    const currentEmail = mails.value?.find((email) => email.uuid === uuid)!;
    currentEmail.is_read = true;
  });
  // TODO: mark checkedEmails as read in the BE
  const client = useClient();
  const request = client.post(
    "mail_imports/folder_mail/mark_emails_as_read/{}/",
    uuids[0],
  );
  request().then((res) => console.log(res));
};

const toggleEmailPin = (uuid: string) => {
  // The UUID comes from the list of emails, so it is in the list
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const selectedEmail = mails.value?.find((email) => email.uuid === uuid)!;
  selectedEmail.is_pinned = !selectedEmail?.is_pinned;
  // TODO: send info to backend that email is pinned
  const client = useClient();
  const request = client.post(
    "api/mail_imports/mark_email_as_pinned/{}/",
    uuid,
  );
  request().then((res) => console.log(res));
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
</script>
