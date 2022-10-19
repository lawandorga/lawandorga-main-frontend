<template>
  <div v-if="actionsEvents">
    <div class="flex justify-end">
      <ButtonNormal
        size="xs"
        kind="action"
        @click="actionsEvents.addEventModalOpen = true"
      >
        Add Event
      </ButtonNormal>
    </div>
    <div v-for="event in actionsEvents.events" :key="event.id">
      {{ event.name }} {{ event.start_time }} {{ event.end_time }}
    </div>
  </div>
  <ActionsEvents ref="actionsEvents" />
</template>

<script setup lang="ts">
import ActionsEvents from "@/components/ActionsEvents.vue";
import { ButtonNormal } from "@lawandorga/components";
import { ref } from "vue";

const actionsEvents = ref<typeof ActionsEvents>();
</script>

<style scoped></style>
