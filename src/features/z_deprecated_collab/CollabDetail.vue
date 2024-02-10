<template>
  <BoxLoader :show="!!doc">
    <div v-if="doc" class="grid max-w-screen-xl gap-6 mx-auto">
      <BreadcrumbsBar
        v-if="doc"
        :base="{ name: 'collab-dashboard' }"
        :pages="[
          {
            name: 'Document',
            to: { name: 'collab-detail', params: { id: doc.id.toString() } },
          },
        ]"
      >
        <DocumentTextIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div
        class="px-6 py-5 bg-white rounded shadow print:shadow-none print:p-0"
      >
        <FormTiptap v-model="model" :room="`Room ${doc.id}`">
          <div class="flex justify-between">
            <div class="w-full">
              <input
                v-model="doc.name"
                type="doc"
                class="px-3 py-2 text-3xl font-bold bg-transparent border-none shadow-none focus:border-none focus:outline-none focus:ring-offset-transparent focus:shadow-none"
                @update:model-value="currentVersionSaved = false"
              />
            </div>
            <div class="flex items-center justify-center pr-3">
              <CircleLoader v-show="!currentVersionSaved" />
              <CheckIcon v-show="currentVersionSaved" class="w-6 h-6" />
            </div>
          </div>
        </FormTiptap>
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import { computed, onUnmounted, ref } from "vue";
import { CollabDocument } from "@/types/collab";
import CollabService from "@/services/collab";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { DocumentTextIcon, CheckIcon } from "@heroicons/vue/24/outline";
import FormTiptap from "@/components/FormTiptap.vue";
import { CircleLoader } from "lorga-ui";
import { useErrorHandling } from "@/api/errors";
import { useRoute } from "vue-router";

const doc = ref<CollabDocument | null>(null);
const content = ref<string>();
const currentVersionSaved = ref(true);
const saveInterval = ref<ReturnType<typeof setInterval> | null>(null);

const route = useRoute();

const change = (newText: string) => {
  if (doc.value === null) return;
  if (doc.value.content_html !== newText) currentVersionSaved.value = false;
};

const model = computed<string>({
  get() {
    if (!content.value) return "";
    return content.value;
  },
  set(newValue: string) {
    content.value = newValue;
    change(newValue);
  },
});

const { handleCommandError } = useErrorHandling();

const save = () => {
  const data = Object.assign({}, doc.value, { content: content.value });
  currentVersionSaved.value = true;

  CollabService.createVersion(data).catch(handleCommandError);
};

const saveIfRequired = () => {
  if (!currentVersionSaved.value) save();
};

// set auto save interval
saveInterval.value = setInterval(saveIfRequired, 5000);

// get the latest version
CollabService.getLatestVersion(route.params.id as string).then((d) => {
  doc.value = d;
  content.value = d.content_html;
});

onUnmounted(() => {
  if (saveInterval.value !== null) clearInterval(saveInterval.value);
});
</script>
