<script setup lang="ts">
import { computed } from "vue";

import { ArticleList } from "@/features/internal/api/useLoginPage";
import { formatLandingDate } from "@/features/internal/utils/landing";

const props = defineProps<{ articles: ArticleList[] }>();

const lead = computed(() => props.articles[0]);
const more = computed(() => props.articles.slice(1, 3));
</script>

<template>
  <section id="neuigkeiten" class="bg-white">
    <div class="mx-auto max-w-[1240px] px-5 py-[88px] sm:px-12 sm:py-[120px]">
      <div class="flex flex-wrap items-baseline justify-between gap-6">
        <h2
          class="text-lo-petrol m-0 text-[clamp(30px,2.8vw,40px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
        >
          Neuigkeiten
        </h2>
        <router-link
          :to="{ name: 'internal-articles' }"
          class="lo-btn lo-btn-outline min-h-[46px] px-5 text-base"
        >
          Alle Neuigkeiten
        </router-link>
      </div>
      <div
        v-if="lead"
        class="mt-10 grid grid-cols-1 items-start gap-12 min-[981px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[981px]:gap-[72px]"
      >
        <article class="border-lo-text border-t-2 pt-6" data-testid="news-lead">
          <time :datetime="lead.date" class="text-lo-muted text-[15px]">
            {{ formatLandingDate(lead.date) }}
          </time>
          <h3
            class="mt-2.5 mb-0 text-[clamp(28px,2.6vw,38px)] leading-[1.12] font-extrabold tracking-[-0.03em]"
          >
            <router-link
              :to="{ name: 'internal-article', params: { id: lead.id } }"
              class="text-lo-text hover:decoration-lo-accent no-underline hover:underline hover:decoration-2"
            >
              {{ lead.title }}
            </router-link>
          </h3>
          <p class="text-lo-text-2 mt-3.5 mb-0 max-w-[32em] text-[19px]">
            {{ lead.preview }}
          </p>
        </article>
        <div class="flex flex-col">
          <article
            v-for="article in more"
            :key="article.id"
            class="border-lo-line-2 border-t pt-5 pb-7"
            data-testid="news-item"
          >
            <time :datetime="article.date" class="text-lo-muted text-[15px]">
              {{ formatLandingDate(article.date) }}
            </time>
            <h3
              class="mt-1.5 mb-0 text-[21px] leading-[1.3] font-bold tracking-[-0.01em]"
            >
              <router-link
                :to="{ name: 'internal-article', params: { id: article.id } }"
                class="text-lo-text hover:decoration-lo-accent no-underline hover:underline hover:decoration-2"
              >
                {{ article.title }}
              </router-link>
            </h3>
            <p class="text-lo-muted mt-1.5 mb-0 text-[17px]">
              {{ article.preview }}
            </p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
