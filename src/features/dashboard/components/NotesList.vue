<script setup lang="ts">
import { CalendarIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { useRouter } from "vue-router";

import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";
import NewBadge from "@/components/NewBadge.vue";
import CreateNote from "@/features/dashboard/actions/CreateNote.vue";
import DeleteNote from "@/features/dashboard/actions/DeleteNote.vue";
import UpdateNote from "@/features/dashboard/actions/UpdateNote.vue";
import { useNotes } from "@/features/dashboard/api/useNotes";
import { useUserStore } from "@/store/user";
import { formatDate } from "@/utils/date";

const userStore = useUserStore();
const { notes, notesQuery } = useNotes();
const router = useRouter();

const canManageNotes = computed(() =>
  userStore.hasPermission("dashboard__manage_notes"),
);

const onNoteClick = (event: MouseEvent) => {
  const link = (event.target as HTMLElement).closest(
    'a[data-type="folderMention"]',
  );
  if (!link) return;
  event.preventDefault();
  router.push({
    name: "folders-detail",
    params: { uuid: link.getAttribute("data-id") ?? "" },
  });
};
</script>

<template>
  <BoxSection title="Notes from your LC" :number-of-items="notes?.length">
    <template v-if="canManageNotes" #action>
      <CreateNote :query="notesQuery" />
    </template>
    <BoxLoader :show="!!notes" class="px-6 py-4">
      <div v-if="notes?.length" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article
          v-for="note in notes"
          :key="note.id"
          class="hover:border-formcolor/20 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md"
          :class="{ 'lg:col-span-2': note.is_wide }"
        >
          <div class="mb-2 flex items-center text-xs text-gray-500">
            <CalendarIcon class="mr-1 h-3 w-3" />
            <span>Created: {{ formatDate(note.created) }}</span>
            <span v-if="note.updated"
              >, updated {{ formatDate(note.updated) }}</span
            >
          </div>
          <div class="flex justify-between">
            <h3 class="mb-2 flex items-center gap-2 font-medium text-gray-700">
              <NewBadge class="mr-1" v-if="note.is_new" />
              {{ note.title }}
            </h3>
            <div v-if="canManageNotes" class="flex gap-6">
              <UpdateNote
                :query="notesQuery"
                :note-id="note.id"
                :note-title="note.title"
                :note-note="note.note"
                :note-order="note.order"
                :note-is-wide="note.is_wide"
              />
              <DeleteNote
                :query="notesQuery"
                :note-id="note.id"
                :note-title="note.title"
              />
            </div>
          </div>
          <!-- eslint-disable vue/no-v-html -->
          <p
            class="prose-sm prose text-sm wrap-break-word whitespace-pre-line text-gray-700"
            v-html="note.note"
            @click="onNoteClick"
          ></p>
          <!-- eslint-enable vue/no-v-html -->
        </article>
      </div>

      <div v-else class="text-gray-500">No notes yet.</div>
    </BoxLoader>
  </BoxSection>
</template>
