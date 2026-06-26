<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";
import CreateNote from "@/features/dashboard/actions/CreateNote.vue";
import DeleteNote from "@/features/dashboard/actions/DeleteNote.vue";
import UpdateNote from "@/features/dashboard/actions/UpdateNote.vue";
import { useNotes } from "@/features/dashboard/api/useNotes";

const { notes, notesQuery } = useNotes();
</script>

<template>
  <BoxSection title="Notes from your LC" :length="notes?.length">
    <template #action>
      <CreateNote :query="notesQuery" />
    </template>
    <BoxLoader :show="!!notes" class="px-6 py-4">
      <div
        v-if="notes?.length"
        class="3xl:grid-cols-3 mt-2 grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <article
          v-for="note in notes"
          :key="note.id"
          class="hover:border-formcolor/20 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-md"
          :class="{ 'lg:col-span-2': note.is_wide }"
        >
          <div class="flex justify-between">
            <h3 class="mb-2 font-medium text-gray-700">
              {{ note.title }}
            </h3>
            <div class="flex gap-6">
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
          ></p>
          <!-- eslint-enable vue/no-v-html -->
        </article>
      </div>

      <div v-else class="w-full text-gray-500">
        No notes yet. Use the button above to create your first note.
      </div>
    </BoxLoader>
  </BoxSection>
</template>
