<script setup lang="ts">
import { computed } from "vue";

import { RoadmapItem } from "@/features/internal/api/useLoginPage";
import { MAIL_SUBJECTS, mailto } from "@/features/internal/utils/landing";

const props = defineProps<{ items: RoadmapItem[] }>();

// the api returns published items ordered by status, position and date
const live = computed(() => props.items.filter((i) => i.status === "live"));
const planned = computed(() =>
  props.items.filter((i) => i.status === "planned"),
);

const fundMail = mailto(MAIL_SUBJECTS.fund);
</script>

<template>
  <section
    id="roadmap"
    class="lo-dark bg-lo-petrol relative overflow-hidden text-white"
  >
    <div
      class="relative mx-auto max-w-[1240px] px-5 py-[88px] sm:px-12 sm:py-36"
    >
      <div
        class="grid grid-cols-1 items-start gap-12 min-[981px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[981px]:gap-24"
      >
        <div>
          <h2
            class="m-0 text-[clamp(36px,3.8vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em] text-white"
          >
            Roadmap
          </h2>
          <p class="text-lo-on-dark mt-6 mb-0 text-[19px]">
            Was wir bauen, richtet sich nach euren Rückmeldungen: aus der
            Umfrage im Dashboard, der Signal-Gruppe und dem direkten Kontakt zur
            Projektkoordination. Die geplanten Funktionen sind konzipiert. Wir
            setzen sie um, sobald ihre Finanzierung steht.
          </p>
          <template v-if="live.length">
            <h3 class="mt-11 mb-0 text-lg font-extrabold text-white">
              Live seit 2026
            </h3>
            <ul
              class="text-lo-on-dark mt-3.5 mb-0 flex list-none flex-col gap-2 p-0 text-[17px]"
              data-testid="roadmap-live"
            >
              <li
                v-for="item in live"
                :key="item.id"
                class="flex items-start gap-2.5"
              >
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9CBCC6"
                  stroke-width="2.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mt-1 flex-none"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
                <span>{{ item.title }}</span>
              </li>
            </ul>
          </template>
          <a
            :href="fundMail"
            class="lo-btn lo-btn-white mt-9 min-h-[50px] px-6"
          >
            Eine Funktion fördern
          </a>
          <p class="text-lo-on-dark-muted mt-3 mb-0 text-[15px]">
            oder direkt an
            <a :href="fundMail" class="font-bold text-white"
              >team@law-orga.de</a
            >
          </p>
        </div>
        <div v-if="planned.length">
          <h3 class="mt-0 mb-2 text-lg font-extrabold text-white">Geplant</h3>
          <details
            v-for="item in planned"
            :key="item.id"
            class="border-t border-[rgba(156,188,198,0.4)] last:border-b"
            data-testid="roadmap-planned"
          >
            <summary
              class="group grid min-h-11 grid-cols-[48px_minmax(0,1fr)_28px] items-center gap-4 rounded-md px-1 py-6 hover:bg-white/[0.06] sm:grid-cols-[56px_minmax(0,1fr)_auto_28px]"
            >
              <img
                v-if="item.icon_url"
                :src="item.icon_url"
                alt=""
                class="block size-12 sm:size-14"
              />
              <span v-else aria-hidden="true"></span>
              <span
                class="decoration-lo-accent text-[19px] leading-[1.25] font-extrabold tracking-[-0.015em] text-white decoration-2 underline-offset-[6px] group-hover:underline sm:text-[23px]"
              >
                {{ item.title }}
              </span>
              <span
                v-if="item.stage"
                class="text-lo-on-dark hidden rounded bg-[#0B4D60] px-2.5 py-[3px] text-sm font-bold sm:inline"
              >
                {{ item.stage }}
              </span>
              <span v-else class="hidden sm:inline" aria-hidden="true"></span>
              <svg
                class="lo-chev"
                aria-hidden="true"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CBCC6"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div class="max-w-[44em] px-1 pb-7 sm:pl-[76px]">
              <p
                v-if="item.stage"
                class="text-lo-on-dark mt-0 mb-3 text-sm font-bold sm:hidden"
              >
                {{ item.stage }}
              </p>
              <p v-if="item.description" class="text-lo-on-dark m-0">
                {{ item.description }}
              </p>
              <ul
                v-if="item.benefits.length"
                class="text-lo-on-dark mt-3.5 mb-0 flex list-disc flex-col gap-1.5 pl-5"
              >
                <li v-for="benefit in item.benefits" :key="benefit">
                  {{ benefit }}
                </li>
              </ul>
              <p
                v-if="item.status_note"
                class="text-lo-on-dark-muted mt-4 mb-0 text-[15px]"
              >
                <span class="font-bold text-white">Stand:</span>
                {{ item.status_note }}
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  </section>
</template>
