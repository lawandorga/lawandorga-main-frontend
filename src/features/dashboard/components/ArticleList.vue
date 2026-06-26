<script setup lang="ts">
import { CalendarIcon, ArrowRightIcon } from "@heroicons/vue/24/outline";

import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";

import { useArticles } from "../api/useArticles";
const { articles } = useArticles();
</script>

<template>
  <BoxSection title="News from Law&Orga" :length="articles?.length">
    <BoxLoader :show="!!articles" class="px-6 py-4">
      <div
        v-if="articles?.length"
        class="mt-2 grid grid-cols-1 gap-6 px-6 py-4 lg:grid-cols-3"
      >
        <article
          v-for="article in articles"
          :key="article.id"
          class="hover:border-formcolor/20 flex flex-col justify-between rounded border border-gray-200 bg-white px-6 py-4 hover:shadow-md"
        >
          <div class="mb-2 flex items-center text-xs text-gray-500">
            <CalendarIcon class="mr-1 h-3 w-3"></CalendarIcon>
            <span>
              {{ new Date(article.date).toLocaleDateString() }}
            </span>
          </div>
          <div class="mb-4">
            <h3 class="mb-3 font-medium text-[18px]">
              {{ article.title }}
            </h3>
            <p
              class="text-sm wrap-break-word whitespace-pre-line text-muted"
            >
              {{ article.preview }}
            </p>
          </div>
          <router-link
            :to="{ name: 'internal-article', params: { id: article.id } }"
            class="text-formcolor dark:hover:bg-accent/50 inline-flex self-start items-center gap-1.5 px-2.5 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none"
            >Read more <ArrowRightIcon class="ml-2 h-3 w-3 text-gray-400" />
          </router-link>
        </article>
      </div>

      <div v-else class="w-full px-6 py-4 text-gray-500">
        No articles at the moment.
      </div>
    </BoxLoader>
  </BoxSection>
</template>
