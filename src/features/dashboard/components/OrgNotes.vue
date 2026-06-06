<script setup lang="ts">
import CreateNote from "@/features/dashboard/actions/CreateNote.vue";
import DeleteNote from "@/features/dashboard/actions/DeleteNote.vue";
import UpdateNote from "@/features/dashboard/actions/UpdateNote.vue";
import { useNotes } from "@/features/dashboard/api/useNotes";

const { notes, notesQuery } = useNotes();
</script>

<template>
  <div class="lg:col-span-2 xl:col-span-3">
    <div class="mt-8 flex justify-between">
      <h2 class="items-baseline text-lg leading-6 font-medium text-gray-700">
        Notes from your LC
      </h2>
      <CreateNote :query="notesQuery" />
    </div>
    <div class="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="note in notes"
        :key="note.id"
        class="relative rounded bg-white px-6 pt-7 pb-4 shadow"
        :class="{ 'lg:col-span-2': note.is_wide }"
      >
        <span
          v-if="note.is_new"
          class="bg-formcolor absolute top-0 right-3 px-2 py-1 text-sm text-white"
          >New</span
        >
        <div class="flex justify-between">
          <h3 class="my-2 font-medium text-gray-700">
            {{ note.title }}
          </h3>
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <p
          class="prose-sm prose text-sm wrap-break-word whitespace-pre-line text-gray-700"
          v-html="note.note"
        ></p>
        <!-- eslint-enable vue/no-v-html -->
        <div class="mt-2 flex justify-end gap-3 space-x-3">
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
      </article>
    </div>
  </div>
</template>
