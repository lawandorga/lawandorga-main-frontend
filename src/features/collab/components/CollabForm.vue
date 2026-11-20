<script setup lang="ts">
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { computed, ref, toRefs } from "vue";

import FormTipTapTwo from "@/components/FormTipTapTwo.vue";
import { useCollabSave } from "@/features/collab/composables/useCollabSave";
import { formatDate } from "@/utils/date";

const props = defineProps<{
  text: string;
  collabUuid: string;
  password: string;
}>();

const { text, collabUuid } = toRefs(props);

const model = ref<string>(text.value);

const { state, lastSavedAt, saveNow } = useCollabSave(model, collabUuid);

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
const shortcutLabel = isMac ? "⌘S" : "Ctrl+S";

const status = computed(() => {
  switch (state.value) {
    case "dirty":
      return {
        icon: PencilSquareIcon,
        iconClass: "text-gray-700",
        text: "Unsaved changes",
        hint: "Saves automatically",
      };
    case "saving":
      return {
        icon: ArrowPathIcon,
        iconClass: "text-gray-700 motion-safe:animate-spin",
        text: "Saving…",
        hint: "",
      };
    case "error":
      return {
        icon: ExclamationTriangleIcon,
        iconClass: "text-red-700",
        text: "Not saved",
        hint: "Your text is still here. Try again.",
      };
    default:
      return {
        icon: CheckCircleIcon,
        iconClass: "text-green-700",
        text: lastSavedAt.value
          ? `Saved at ${formatDate(lastSavedAt.value.toISOString(), false, true)}`
          : "All changes saved",
        hint: "",
      };
  }
});

const saveInactive = computed(
  () => state.value === "saved" || state.value === "saving",
);

const saveTitle = computed(() => {
  if (state.value === "saved") return "No unsaved changes";
  if (state.value === "saving") return "Saving…";
  return undefined;
});

function onSaveClick() {
  if (saveInactive.value) return;
  void saveNow();
}

function onKeydown(event: KeyboardEvent) {
  const isSaveShortcut =
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    !event.shiftKey &&
    event.key.toLowerCase() === "s";
  if (!isSaveShortcut) return;
  event.preventDefault();
  void saveNow();
}
</script>

<template>
  <div @keydown="onKeydown">
    <FormTipTapTwo v-model="model" :room="collabUuid" :password="password">
      <div
        class="flex items-center justify-between gap-4 px-3 py-2 print:hidden"
      >
        <div
          role="status"
          aria-live="polite"
          class="flex items-center gap-2 text-sm text-gray-900"
          data-test="collab-save-status"
        >
          <component
            :is="status.icon"
            class="h-5 w-5 shrink-0"
            :class="status.iconClass"
            aria-hidden="true"
          />
          <div>
            <p class="font-medium">{{ status.text }}</p>
            <p v-if="status.hint" class="text-xs text-gray-700">
              {{ status.hint }}
            </p>
          </div>
        </div>
        <!--
          A native button instead of lorga-ui's ButtonNormal on purpose:
          ButtonNormal renders a wrapper <div>, so fallthrough attributes like
          aria-disabled, aria-keyshortcuts and title land on that div instead of
          the <button>. Its `disabled` prop sets native `disabled`, which removes
          the button from the tab order. Revisit if lorga-ui changes that.
        -->
        <button
          type="button"
          class="focus-visible:ring-formcolor inline-flex shrink-0 items-center gap-2 rounded-lg border border-transparent px-3 py-1.5 text-sm font-semibold transition duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          :class="
            saveInactive
              ? 'cursor-not-allowed bg-gray-100 text-gray-700'
              : 'bg-formcolor hover:bg-formcolor/90 cursor-pointer text-white shadow-sm'
          "
          :aria-disabled="saveInactive ? 'true' : undefined"
          :title="saveTitle"
          aria-keyshortcuts="Control+S Meta+S"
          data-test="collab-save-button"
          @click="onSaveClick"
        >
          {{ state === "error" ? "Retry" : "Save" }}
          <kbd
            aria-hidden="true"
            class="rounded border border-current px-1 font-sans text-xs font-normal"
          >
            {{ shortcutLabel }}
          </kbd>
        </button>
      </div>
    </FormTipTapTwo>
  </div>
</template>
