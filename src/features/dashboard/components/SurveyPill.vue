<script setup lang="ts">
import { ModalFree } from "lorga-ui";
import { ref } from "vue";

import SurveyIcon from "./SurveyIcon.vue";
import SurveyQrCode from "./SurveyQrCode.vue";

const SURVEY_URL = "https://www.umfrageonline.com/c/law-orga-umfrage-alle-user";

const open = ref(false);
const copied = ref(false);

function copyLink() {
  navigator.clipboard.writeText(SURVEY_URL).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
}
</script>

<template>
  <button
    type="button"
    class="survey-pill border-formcolor bg-formcolor cursor-pointer overflow-hidden rounded-full border transition-[background-color,border-color,box-shadow] duration-200 hover:border-blue-700 hover:bg-blue-700"
    aria-haspopup="dialog"
    :aria-expanded="open"
    @click="open = true"
  >
    <div class="flex items-center gap-2.5 py-1.25 pr-3.5 pl-1.25">
      <SurveyIcon :size="36" class="text-formcolor shrink-0" />
      <div class="flex flex-col gap-px text-left">
        <span class="text-xs font-bold tracking-wider text-white/60 uppercase">
          User Survey
        </span>
        <span class="text-xs leading-snug text-white">
          Help us improve Law&amp;Orga
        </span>
      </div>
    </div>
  </button>

  <ModalFree v-model="open" title="User Survey" width="max-w-sm">
    <div class="flex flex-col items-center gap-4 py-1">
      <SurveyIcon :size="56" class="text-formcolor" />

      <div class="rounded-xl border border-blue-100 bg-blue-50 p-3.5">
        <SurveyQrCode :size="160" />
      </div>

      <div
        class="flex w-full items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2"
      >
        <span
          class="text-formcolor flex-1 overflow-hidden font-mono text-xs text-ellipsis whitespace-nowrap"
        >
          {{ SURVEY_URL }}
        </span>
        <button
          type="button"
          class="rounded border px-2 py-1 text-xs font-semibold whitespace-nowrap transition-colors"
          :class="
            copied
              ? 'bg-formcolor border-formcolor text-white'
              : 'text-formcolor hover:bg-formcolor border-blue-200 bg-white hover:text-white'
          "
          :aria-label="copied ? 'Link copied to clipboard' : 'Copy survey link'"
          @click="copyLink"
        >
          {{ copied ? "Copied!" : "Copy" }}
        </button>
      </div>

      <a
        href="https://www.umfrageonline.com/c/law-orga-umfrage-alle-user"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-formcolor flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-blue-700"
      >
        Open Survey
        <span class="sr-only">, opens in new tab</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 10L10 2M10 2H5M10 2V7"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>

      <p class="text-center text-xs text-gray-500">
        Or scan the QR code with your phone
      </p>
    </div>
  </ModalFree>
</template>

<style scoped>
.survey-pill:hover {
  box-shadow:
    0 0 0 3px rgba(0, 79, 99, 0.2),
    0 4px 18px rgba(0, 60, 77, 0.3);
}
</style>
