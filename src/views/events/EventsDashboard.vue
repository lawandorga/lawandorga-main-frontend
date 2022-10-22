<template>
  <BoxLoader :show="!!actionsEvents">
    <div class="mx-auto space-y-6 max-w-screen-2xl">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <CalendarDaysIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonNormal
            size="xs"
            kind="action"
            @click="actionsEvents.addEventModalOpen = true"
          >
            Add Event
          </ButtonNormal>
        </template>
      </BreadcrumbsBar>
      <div v-if="actionsEvents">
        <div v-for="event in actionsEvents.events" :key="event.id">
          {{ event.name }} {{ event.start_time }} {{ event.end_time }}
        </div>
      </div>
    </div>
  </BoxLoader>
  <ActionsEvents ref="actionsEvents" />
</template>

<script setup lang="ts">
import ActionsEvents from "@/components/ActionsEvents.vue";
import { ButtonNormal } from "@lawandorga/components";
import { CalendarDaysIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { ref } from "vue";

const actionsEvents = ref<typeof ActionsEvents>();
</script>
