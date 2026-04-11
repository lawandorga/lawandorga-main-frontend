<script setup lang="ts">
import { useArticles } from "../api/useArticles";
import { ButtonNormal } from "lorga-ui";
const { articles } = useArticles();
</script>

<template>
  <div v-if="articles?.length" class="lg:col-span-2 xl:col-span-3">
    <div class="flex justify-between mt-8">
      <h2 class="items-baseline text-lg font-medium leading-6 text-gray-700">
        News from Law&Orga
      </h2>
    </div>
    <div class="grid grid-cols-1 gap-6 mt-2 lg:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="article in articles"
        :key="article.id"
        class="flex flex-col justify-between px-6 pt-4 pb-4 bg-white rounded shadow"
      >
        <p class="text-sm text-gray-500 text-end">
          {{ new Date(article.date).toLocaleDateString() }}
        </p>
        <div>
          <h3 class="mb-2 font-medium text-gray-700">
            {{ article.title }}
          </h3>
          <p
            class="text-sm text-gray-700 wrap-break-word whitespace-pre-line [&>a]:font-medium [&>a]:text-formcolor"
          >
            {{ article.description }}
          </p>
        </div>
        <router-link
          :to="{ name: 'internal-article', params: { id: article.id } }"
          class="ml-auto"
        >
          <ButtonNormal kind="action">Read more</ButtonNormal>
        </router-link>
      </article>
    </div>
  </div>
</template>
