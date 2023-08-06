<script setup lang="ts">
import useClient from "@/api/client";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import useQuery from "@/composables/useQuery";
import { CircleLoader } from "lorga-ui";
import { ref, toRefs, watch } from "vue";
import TimelineEventCreate from "../actions/TimelineEventCreate.vue";
import TimelineEventDelete from "../actions/TimelineEventDelete.vue";
import { formatDate } from "@/utils/date";
import TimelineEventUpdate from "../actions/TimelineEventUpdate.vue";

const props = defineProps<{
  query: () => void;
  folderUuid: string;
  selectedType: string;
}>();
const { folderUuid, selectedType } = toRefs(props);

interface ITimelineEvent {
  uuid: string;
  time: string;
  text: string;
  title: string;
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
          <ul class="space-y-2 list-disc list-inside">
            <li v-for="event in timeline" :key="event.uuid" class="">
              <div class="inline-block">
                <div class="flex flex-col">
                  <div class="flex items-center">
                    <div class="inline-block pr-4">
                      {{ formatDate(event.time) }}: {{ event.title }}
                    </div>
                    <div class="flex items-center space-x-4">
                      <TimelineEventUpdate
                        :folder-uuid="folderUuid"
                        :event-uuid="event.uuid"
                        :event-time="event.time"
                        :event-text="event.text"
                        :event-title="event.title"
                        :query="timelineQuery"
                      />
                      <TimelineEventDelete
                        :folder-uuid="folderUuid"
                        :name="event.text.slice(0, 20) + '...'"
                        :timeline-event-uuid="event.uuid"
                        :query="timelineQuery"
                      />
                    </div>
                  </div>
                  <div class="inline-block">
                    <p class="prose-sm">{{ event.text }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </BoxHeadingStats>
  </div>
  <div v-else-if="loading"><CircleLoader /></div>
</template>
