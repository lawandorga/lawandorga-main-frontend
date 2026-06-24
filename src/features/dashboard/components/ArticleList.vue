<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BoxSection from "@/components/BoxSection.vue";
import { useArticles } from "../api/useArticles";
import { CalendarIcon, ArrowRightIcon } from "@heroicons/vue/24/outline";
const { articles } = useArticles();
</script>

<template>
  <BoxSection title="News from Law&Orga" :length="articles?.length">
    <div class="px-6 py-4">
      <BoxLoader :show="!!articles"></BoxLoader>
      <div
        v-if="articles?.length"
        class="grid grid-cols-1 gap-6 px-6 py-4 mt-2 lg:grid-cols-3"
      >
        <article
          v-for="article in articles"
          :key="article.id"
          class="flex flex-col justify-between px-6 py-4 bg-white border border-gray-200 rounded hover:border-formcolor/20 hover:shadow-md"
        >
          <div class="flex items-center mb-2 text-sm text-gray-500">
            <CalendarIcon class="w-5 h-5 mr-1"></CalendarIcon>
            <span>
              {{ new Date(article.date).toLocaleDateString() }}
            </span>
          </div>
          <div>
            <h3 class="mb-2 font-medium text-gray-700">
              {{ article.title }}
            </h3>
            <p
              class="text-sm text-gray-700 wrap-break-word whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
            >
              {{ article.preview }}
            </p>
          </div>
          <router-link
            :to="{ name: 'internal-article', params: { id: article.id } }"
            class="mt-2"
            >Read more <ArrowRightIcon class="w-4 h-4 ml-2 text-gray-400" />
          </router-link>
        </article>
      </div>

      <div v-else class="w-full px-6 py-4 text-gray-500">
        No articles at the moment.
      </div>
    </div>
  </BoxSection>
</template>
