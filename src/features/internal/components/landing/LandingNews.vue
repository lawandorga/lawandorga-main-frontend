<script setup lang="ts">
import { computed } from "vue";

import { formatLandingDate } from "@/features/internal/utils/landing";

import ArticleReadMore from "./ArticleReadMore.vue";

// an article as returned by api/internal/pages/index/
export interface ArticleTeaser {
  id: number;
  title: string;
  preview: string;
  date: string;
}

const props = defineProps<{ articles: ArticleTeaser[] }>();

const lead = computed(() => props.articles[0]);
const more = computed(() => props.articles.slice(1, 3));
</script>

<template>
  <section id="neuigkeiten" class="bg-white">
    <div class="mx-auto max-w-[1240px] px-5 py-[88px] sm:px-12 sm:py-[120px]">
      <h2
        class="text-lo-petrol m-0 text-[clamp(30px,2.8vw,40px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
      >
        Neuigkeiten
      </h2>
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
          <p
            v-if="lead.preview"
            class="text-lo-text-2 mt-3.5 mb-0 line-clamp-2 max-w-[32em] text-[19px]"
          >
            {{ lead.preview }}
          </p>
          <ArticleReadMore :id="lead.id" :title="lead.title" />
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
            <p
              v-if="article.preview"
              class="text-lo-muted mt-1.5 mb-0 line-clamp-2 text-[17px]"
            >
              {{ article.preview }}
            </p>
            <ArticleReadMore :id="article.id" :title="article.title" />
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
