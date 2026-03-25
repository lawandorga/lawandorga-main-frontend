<script setup lang="ts">
import { ref } from "vue";
import { ModalFree } from "lorga-ui";
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
    class="survey-pill inline-flex items-center rounded-full cursor-pointer overflow-hidden transition-[background-color,border-color,box-shadow] duration-200 border border-formcolor bg-formcolor hover:bg-blue-700 hover:border-blue-700"
    aria-haspopup="dialog"
    :aria-expanded="open"
    @click="open = true"
  >
    <div class="flex items-center gap-2.5 py-1.25 pl-1.25 pr-3.5">
      <SurveyIcon :size="36" class="shrink-0 text-formcolor" />
      <div class="flex flex-col gap-px text-left">
        <span class="text-xs font-bold tracking-wider uppercase text-white/60">
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

      <div class="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
        <SurveyQrCode :size="160" />
      </div>

      <div
        class="flex items-center w-full gap-2 px-3 py-2 border border-blue-100 rounded-lg bg-blue-50"
      >
        <span
          class="flex-1 overflow-hidden font-mono text-xs text-formcolor text-ellipsis whitespace-nowrap"
        >
          {{ SURVEY_URL }}
        </span>
        <button
          type="button"
          class="px-2 py-1 text-xs font-semibold transition-colors border rounded whitespace-nowrap"
          :class="
            copied
              ? 'bg-formcolor text-white border-formcolor'
              : 'text-formcolor border-blue-200 bg-white hover:bg-formcolor hover:text-white'
          "
          :aria-label="copied ? 'Link copied to clipboard' : 'Copy survey link'"
          @click="copyLink"
        >
          {{ copied ? "Copied!" : "Copy" }}
        </button>
      </div>

      <a
        :href="SURVEY_URL"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center justify-center gap-1.5 w-full py-2.5 bg-formcolor text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors no-underline"
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

      <p class="text-xs text-center text-gray-500">
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
