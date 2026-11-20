<script setup lang="ts">
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
import { ButtonNormal, ModalFree } from "lorga-ui";
import { computed, onBeforeUnmount, ref, toRefs, watch } from "vue";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

import FormTipTapTwo from "@/components/FormTipTapTwo.vue";
import { useCollabSave } from "@/features/collab/composables/useCollabSave";
import { formatDate } from "@/utils/date";

const props = defineProps<{
  text: string;
  collabUuid: string;
}>();

const { text, collabUuid } = toRefs(props);

const model = ref<string>(text.value);

const { state, lastSavedAt, saveNow, flush, resetBaseline } = useCollabSave(
  model,
  collabUuid,
);

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

// leaving the collab: save first, ask only if saving failed

async function saveBeforeLeaving(): Promise<boolean> {
  const saved = await saveNow();
  // the text may have changed while a request was already in flight
  return saved && (await saveNow());
}

const showLeaveDialog = ref(false);
const retryingInDialog = ref(false);

// lorga-ui's secondary (indigo-200 ring) and delete (red-200 border) buttons
// have barely visible focus indicators. The class lands on ButtonNormal's
// wrapper <div>, so target the inner <button>; "!" beats lorga-ui's
// focus:outline-none. formcolor #003c4d has 11.98:1 contrast against white.
const dialogButtonFocus =
  "[&>button:focus-visible]:outline-solid! [&>button:focus-visible]:outline-2! [&>button:focus-visible]:outline-offset-2! [&>button:focus-visible]:outline-formcolor!";
// eslint-disable-next-line no-unused-vars
let resolveLeaveDialog: ((leave: boolean) => void) | null = null;

const askToLeave = (): Promise<boolean> =>
  new Promise((resolve) => {
    resolveLeaveDialog = resolve;
    showLeaveDialog.value = true;
  });

const closeLeaveDialog = (leave: boolean) => {
  resolveLeaveDialog?.(leave);
  resolveLeaveDialog = null;
  showLeaveDialog.value = false;
};

// Escape, the close button and a backdrop click mean "Stay here"
watch(showLeaveDialog, (open) => {
  if (!open) closeLeaveDialog(false);
});

async function retryInDialog() {
  if (retryingInDialog.value) return;
  retryingInDialog.value = true;
  const saved = await saveBeforeLeaving();
  retryingInDialog.value = false;
  if (saved) closeLeaveDialog(true);
}

async function guardLeaving(): Promise<false | undefined> {
  if (state.value === "saved") return;
  if (await saveBeforeLeaving()) return;
  return (await askToLeave()) ? undefined : false;
}

onBeforeRouteUpdate((to) => {
  // only switching to another collab, record or folder leaves this collab
  if (to.query.selectedId === collabUuid.value) return;
  return guardLeaving();
});

onBeforeRouteLeave(() => guardLeaving());

// closing or reloading the tab: let the browser show its native warning

const onBeforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  // legacy browsers only show the warning when returnValue is set
  event.returnValue = "";
};

watch(
  state,
  (value) => {
    if (value === "saved") {
      window.removeEventListener("beforeunload", onBeforeUnload);
    } else {
      window.addEventListener("beforeunload", onBeforeUnload);
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  // safety net: send a pending autosave right away
  flush();
  window.removeEventListener("beforeunload", onBeforeUnload);
});
</script>

<template>
  <div @keydown="onKeydown">
    <FormTipTapTwo v-model="model" @ready="resetBaseline">
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

    <ModalFree v-model="showLeaveDialog" title="Your changes are not saved">
      <p class="mb-5 text-sm text-gray-700">
        Saving failed before you left this document. If you leave now, your last
        edits are lost.
      </p>
      <div class="flex flex-wrap items-center justify-end gap-3">
        <ButtonNormal kind="primary" @click="retryInDialog">
          {{ retryingInDialog ? "Saving…" : "Try saving again" }}
        </ButtonNormal>
        <ButtonNormal
          kind="secondary"
          :class="dialogButtonFocus"
          @click="closeLeaveDialog(false)"
        >
          Stay here
        </ButtonNormal>
        <ButtonNormal
          kind="delete"
          :class="dialogButtonFocus"
          @click="closeLeaveDialog(true)"
        >
          Leave without saving
        </ButtonNormal>
      </div>
    </ModalFree>
  </div>
</template>
