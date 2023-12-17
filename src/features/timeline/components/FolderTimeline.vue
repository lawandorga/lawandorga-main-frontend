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
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/20/solid";

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

const getItemTypeText = (type: string) => {
  switch (type) {
    case "event":
      return "Event";
    case "follow_up":
      return "Follow Up";
    case "old":
      return "Old";
    default:
      return "Unknown";
  }
};
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
            Hint: Follow Ups will be shown on the dashboard as soon as the
            selected date arrives. Once it is marked as done it will not be
            shown anymore.
          </p>
        </div>
        <div class="pt-5">
          <ul class="">
            <li v-for="(item, itemIdx) in timeline" :key="item.uuid">
              <div class="relative pb-8">
                <span
                  v-if="itemIdx !== timeline.length - 1"
                  class="absolute left-1.5 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
                <div class="relative flex space-x-3">
                  <div>
                    <span
                      class="flex items-center justify-center w-3 h-3 bg-gray-300 rounded-full ring-8 ring-white"
                    ></span>
                  </div>
                  <div
                    class="flex justify-between flex-1 min-w-0 -mt-1 space-x-4"
                  >
                    <div>
                      <div class="flex items-center space-x-2">
                        <span
                          class="inline-block bg-gray-500 rounded text-gray-50 px-2 py-0.5 text-xs"
                        >
                          {{ getItemTypeText(item.type) }}
                        </span>
                        <p class="text-base text-gray-800">
                          {{ item.title }}
                        </p>
                        <CheckCircleIcon
                          v-if="item.type === 'follow_up' && item.is_done"
                          class="inline-block w-5 h-5 text-green-600"
                        />
                        <XCircleIcon
                          v-else-if="item.type === 'follow_up'"
                          class="inline-block w-5 h-5 text-red-600"
                        />
                      </div>
                      <div class="flex justify-between w-full">
                        <p class="block max-w-xl text-sm text-gray-700">
                          {{ item.text }}
                        </p>
                      </div>
                    </div>
                    <div
                      class="text-sm text-right text-gray-500 whitespace-nowrap"
                    >
                      <time :datetime="item.time">
                        {{ formatDate(item.time) }}
                      </time>
                      <div class="flex justify-end space-x-3">
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
