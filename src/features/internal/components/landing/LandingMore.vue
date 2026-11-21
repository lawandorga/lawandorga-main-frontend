<script setup lang="ts">
import { LandingArea } from "@/features/internal/content/landingContent";
import {
  DEFAULT_SCREENSHOT_NOTE,
  MAIL_SUBJECTS,
  mailto,
} from "@/features/internal/utils/landing";

defineProps<{ areas: LandingArea[] }>();

const demoMail = mailto(MAIL_SUBJECTS.demo);
</script>

<template>
  <div
    class="border-lo-line mt-28 grid grid-cols-1 items-start gap-12 border-t pt-14 min-[981px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[981px]:gap-24"
  >
    <div>
      <h3
        class="text-lo-petrol m-0 text-[clamp(28px,2.6vw,36px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
      >
        Außerdem in Law&amp;Orga
      </h3>
      <p class="text-lo-text-2 mt-4 mb-0 max-w-[26em] text-lg">
        Ihr wollt alles selbst ausprobieren? Wir geben euch Zugang zu einer
        Beispiel-Organisation.
      </p>
      <a :href="demoMail" class="lo-btn lo-btn-outline mt-6 min-h-[50px] px-6">
        Demo-Zugang anfragen
      </a>
      <p class="text-lo-muted mt-3 mb-0 text-[15px]">
        oder direkt an
        <a :href="demoMail" class="text-lo-petrol font-bold"
          >team@law-orga.de</a
        >
      </p>
    </div>
    <ul
      v-if="areas.length"
      class="border-lo-line m-0 list-none border-b p-0"
      data-testid="more-list"
    >
      <li
        v-for="area in areas"
        :key="area.id"
        class="border-lo-line border-t"
        data-testid="more-row"
      >
        <details v-if="area.screenshot_url">
          <summary
            class="grid grid-cols-[56px_minmax(0,1fr)_24px] items-start gap-[18px] rounded-md px-2 py-5 hover:bg-[#F1F6F7]"
          >
            <img
              v-if="area.icon_url"
              :src="area.icon_url"
              alt=""
              class="block size-14"
            />
            <span v-else aria-hidden="true"></span>
            <span>
              <span
                class="text-lo-petrol block text-[19px] font-extrabold tracking-[-0.01em]"
              >
                {{ area.title }}
              </span>
              <span class="text-lo-text-2 mt-1 block text-base leading-[1.55]">
                {{ area.description }}
              </span>
            </span>
            <svg
              class="lo-chev mt-4"
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#003C4D"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <figure class="mx-0 mt-0 mb-6">
            <img
              :src="area.screenshot_url"
              :alt="area.screenshot_alt"
              class="block h-auto w-full rounded-lg border border-[#BCC8CA]"
            />
            <figcaption class="text-lo-muted mt-2 text-sm">
              {{ area.screenshot_note || DEFAULT_SCREENSHOT_NOTE }}
            </figcaption>
          </figure>
        </details>
        <div
          v-else
          class="grid grid-cols-[56px_minmax(0,1fr)] items-start gap-[18px] px-2 py-5"
        >
          <img
            v-if="area.icon_url"
            :src="area.icon_url"
            alt=""
            class="block size-14"
          />
          <span v-else aria-hidden="true"></span>
          <span>
            <span
              class="text-lo-petrol block text-[19px] font-extrabold tracking-[-0.01em]"
            >
              {{ area.title }}
            </span>
            <span class="text-lo-text-2 mt-1 block text-base leading-[1.55]">
              {{ area.description }}
            </span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
