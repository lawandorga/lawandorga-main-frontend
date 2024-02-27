<!-- similar to FolderDataSheet.vue for example  -->
<!-- will be used in features/folders/views/FoldersDetail.vue -->
<!-- TODO: aaaaaaaaall the tooltips -->
<template>
  <div v-if="mails">
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
        <button class="col-start-2" @click="markAsRead">
          <img src="../icons/LetterOpen.svg" />
        </button>
        <span v-if="fieldsShown.subject" class="col-start-3">Betreff</span>
        <span v-if="fieldsShown.sender" class="col-start-4">
          Absender:in(nen)
        </span>
        <button class="col-start-6" @click="settingsOpen = true">
          <img src="../icons/Settings.svg" />
        </button>
        <template v-for="mail in mails" :key="mail.uuid">
          <input
            :checked="checkedEmails.includes(mail.uuid)"
            class="col-start-1"
            type="checkbox"
            @input="() => toggleCheckedEmail(mail.uuid)"
          />
          <!-- TODO: make the pin a button -->
          <!-- TODO: add pinning function including sending pin info to BE -->
          <img
            v-if="mail.pinned"
            src="../icons/PinFilled.svg"
            class="col-start-2"
          />
          <img
            v-if="!mail.pinned"
            class="col-start-2"
            src="../icons/PinEmpty.svg"
          />
          <!-- TODO: sender semi-bold for unread -->
          <button
            :class="`contents ${mail.read ? '' : 'font-bold'}`"
            @click="() => toggleEmail(mail.uuid)"
          >
            <!-- TODO: figure out styling when subject and date are selected -->
            <template
              v-for="field in (
                Object.keys(fieldsShown) as possibleFields[]
              ).filter((key) => fieldsShown[key])"
              :key="field"
            >
              <!-- TODO: ellipsis for long subjects -->
              <span
                :class="`col-span-1 ${
                  field === 'date' ? 'text-right' : 'text-left'
                }`"
              >
                {{ mail[field] }}
              </span>
            </template>
            <img
              v-if="!expandedEmails.includes(mail.uuid)"
              class="col-start-6 ml-auto"
              src="../icons/Caret.svg"
            />
            <img
              v-if="expandedEmails.includes(mail.uuid)"
              class="col-start-6 ml-auto rotate-180"
              src="../icons/Caret.svg"
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
        <h3>Angezeigte Informationen</h3>
        <input id="subject" v-model="fieldsShown.subject" type="checkbox" />
        <label for="subject">Betreff</label>
        <input id="sender" v-model="fieldsShown.sender" type="checkbox" />
        <label for="sender">Absender:in(nen)</label>
        <input id="date" v-model="fieldsShown.date" type="checkbox" />
        <label for="date">Datum</label>
      </ModalFree>
    </BoxHeadingStats>
  </div>
  <!-- TODO: is there an else? -->
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import useGet from "@/composables/useGet";
import { ModalFree } from "lorga-ui";
import { computed, ref, toRefs } from "vue";
import { useRoute } from "vue-router";

// props
const props = defineProps<{
  folderUuid: string;
  selectedType: string;
}>();
const { folderUuid, selectedType } = toRefs(props);

const client = useClient();
const request = client.get(`api/mail_imports/query/folder_mails/${folderUuid.value}`); // add uuid
const route = useRoute();
// const folderUuid = computed(() => route.params.uuid as string);
const mails2 = useGet(request, {}, folderUuid);
// console.log(mails())

const mails = [
  {
    subject: "First email",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date().toLocaleDateString("de-DE"),
    pinned: false,
    sender: "hello@gmail.com",
    recipients: ["test@this.de"],
    uuid: "123",
    read: false,
  },
  {
    subject: "Second email",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date().toLocaleDateString("de-DE"),
    pinned: true,
    sender: "hello@gmail.com",
    recipients: ["test@this.de"],
    uuid: "234",
    read: true,
  },
  {
    subject: "Third email",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    date: new Date().toLocaleDateString("de-DE"),
    pinned: false,
    sender: "hello@gmail.com",
    recipients: ["test@this.de"],
    uuid: "345",
    read: true,
  },
].sort((mail) => (mail.pinned ? -1 : 1)); // TODO: add sorting by time

const settingsOpen = ref<boolean>(false);
const sorting = ref<"asc" | "desc">("desc");
type possibleFields = "subject" | "sender" | "date";
const fieldsShown = ref<{ [F in possibleFields]: boolean }>({
  subject: true,
  sender: false,
  date: false,
});

const checkedEmails = ref<string[]>([]);
const toggleCheckedEmail = (uuid: string) => {
  if (checkedEmails.value.includes(uuid)) {
    checkedEmails.value.splice(checkedEmails.value.indexOf(uuid), 1);
    (document.getElementById("toggleAllEmails") as HTMLInputElement).checked = false;
  } else {
    checkedEmails.value.push(uuid);
  }
};
const toggleAllCheckedEmails = (e: Event) => {
  if ((e.target as HTMLInputElement).checked) {
    checkedEmails.value = mails.map((mail) => mail.uuid);
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
