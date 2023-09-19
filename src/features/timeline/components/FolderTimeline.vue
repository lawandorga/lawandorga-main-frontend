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
import FollowUpCreate from "../actions/FollowUpCreate.vue";
import FollowUpUpdate from "../actions/FollowUpUpdate.vue";
import FollowUpDelete from "../actions/FollowUpDelete.vue";
import FollowUpSetDone from "../actions/FollowUpSetDone.vue";

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
  type: string;
  is_done: boolean | null;
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
        <FollowUpCreate :folder-uuid="folderUuid" :query="timelineQuery" />
      </template>
      <div>
        <div>
          <p class="prose-sm">
            The timeline feature is now ready to use. Follow Ups will be shown
            on the dashboard as soon as the selected date arrives. Once it is
            marked as done it will not be shown anymore. The old events will be
            removed end of this year, please make sure to create new timeline
            events if you need them.
          </p>
        </div>
        <div class="pt-5">
          <ul class="space-y-2 list-disc list-inside">
            <li v-for="item in timeline" :key="item.uuid" class="">
              <div class="inline-block">
                <div class="flex flex-col">
                  <div class="flex items-center">
                    <div class="inline-block pr-4">
                      {{ item.type }} - {{ formatDate(item.time) }}:
                      {{ item.title }}
                    </div>
                    <div class="flex items-center space-x-4">
                      <TimelineEventUpdate
                        v-if="item.type === 'event'"
                        :event-uuid="item.uuid"
                        :event-time="item.time"
                        :event-text="item.text"
                        :event-title="item.title"
                        :query="timelineQuery"
                      />
                      <TimelineEventDelete
                        v-if="item.type === 'event'"
                        :name="item.title"
                        :timeline-event-uuid="item.uuid"
                        :query="timelineQuery"
                      />
                      <FollowUpUpdate
                        v-if="item.type === 'follow_up'"
                        :follow-up-uuid="item.uuid"
                        :follow-up-time="item.time"
                        :follow-up-text="item.text"
                        :follow-up-title="item.title"
                        :follow-up-is-done="item.is_done"
                        :query="timelineQuery"
                      />
                      <FollowUpSetDone
                        v-if="item.type === 'follow_up' && !item.is_done"
                        :name="item.title"
                        :follow-up-uuid="item.uuid"
                        :query="timelineQuery"
                      />
                      <FollowUpDelete
                        v-if="item.type === 'follow_up'"
                        :name="item.title"
                        :follow-up-uuid="item.uuid"
                        :query="timelineQuery"
                      />
                    </div>
                  </div>
                  <div class="inline-block">
                    <p class="prose-sm">{{ item.text }}</p>
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
