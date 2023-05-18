<script setup lang="ts">
import useClient from "@/api/client";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import useQuery from "@/composables/useQuery";
import { CircleLoader } from "@lawandorga/components";
import { ref, toRefs, watch } from "vue";
import TimelineEventCreate from "../actions/TimelineEventCreate.vue";
import TimelineEventDelete from "../actions/TimelineEventDelete.vue";

const props = defineProps<{
  query: () => void;
  folderUuid: string;
  selectedType: string;
}>();
const { folderUuid, selectedType } = toRefs(props);

interface ITimelineEvent {
  uuid: string;
  text: string;
}

// retrieve timeline
const timeline = ref<null | ITimelineEvent[]>(null);
const loading = ref(false);

const client = useClient();
const request = client.get("/api/timeline/query/timeline/{}/", folderUuid);
const timelineQuery = useQuery(request, timeline);

// get timeline
const update = () => {
  if (selectedType.value === "TIMELINE") {
    loading.value = true;
    timelineQuery().then(() => {
      loading.value = false;
    });
  }
};
watch(selectedType, () => {
  if (selectedType.value === "TIMELINE") update();
});
update();
</script>

<template>
  <div v-if="timeline">
    <BoxHeadingStats
      title="Timeline"
      :show="selectedType === 'TIMELINE'"
      :stats="[]"
    >
      <template #buttons>
        <TimelineEventCreate :folder-uuid="folderUuid" :query="timelineQuery" />
      </template>
      <div>
        <div>
          <p class="prose-sm">
            This timeline feature is in beta version and subject to change.
            However, data will not be lost. But the loading times might not be
            optimal. And it is not in its final version yet.
          </p>
        </div>
        <div class="pt-5">
          <ul class="list-disc list-inside">
            <li v-for="event in timeline" :key="event.uuid">
              <span class="inline-block pr-4">{{ event.text }}</span>
              <TimelineEventDelete
                :folder-uuid="folderUuid"
                :name="event.text.slice(0, 20) + '...'"
                :timeline-event-uuid="event.uuid"
                :query="timelineQuery"
              />
            </li>
          </ul>
        </div>
      </div>
    </BoxHeadingStats>
  </div>
  <div v-else-if="loading"><CircleLoader /></div>
</template>
