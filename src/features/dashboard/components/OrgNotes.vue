<script setup lang="ts">
import CreateNote from "@/features/dashboard/actions/CreateNote.vue";
import DeleteNote from "@/features/dashboard/actions/DeleteNote.vue";
import UpdateNote from "@/features/dashboard/actions/UpdateNote.vue";
import { useNotes } from "@/features/dashboard/api/useNotes";

const { notes, notesQuery } = useNotes();
</script>

<template>
  <div class="lg:col-span-2 xl:col-span-3">
    <div class="flex justify-between mt-8">
      <h2 class="items-baseline text-lg font-medium leading-6 text-gray-700">
        Notes from your LC
      </h2>
      <CreateNote :query="notesQuery" />
    </div>
    <div class="grid grid-cols-1 gap-6 mt-2 lg:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="note in notes"
        :key="note.id"
        class="px-6 pt-4 pb-4 bg-white rounded shadow"
        :class="{ 'lg:col-span-2': note.is_wide }"
      >
        <h3 class="mb-2 font-medium text-gray-700">
          {{ note.title }}
        </h3>
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="text-sm prose-sm prose text-gray-700 break-words whitespace-pre-line"
          v-html="note.note_with_links"
        ></p>
        <!-- eslint-enable vue/no-v-html -->
        <div class="flex justify-end gap-3 mt-2 space-x-3">
          <UpdateNote
            :query="notesQuery"
            :note-id="note.id"
            :note-title="note.title"
            :note-note="note.note"
            :note-order="note.order"
          />
          <DeleteNote
            :query="notesQuery"
            :note-id="note.id"
            :note-title="note.title"
          />
        </div>
      </article>
    </div>
  </div>
</template>
