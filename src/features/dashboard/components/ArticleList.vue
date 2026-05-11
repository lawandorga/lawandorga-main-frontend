<script setup lang="ts">
import { ButtonNormal } from "lorga-ui";

import { useArticles } from "../api/useArticles";
const { articles } = useArticles();
</script>

<template>
  <div v-if="articles?.length" class="lg:col-span-2 xl:col-span-3">
    <div class="mt-8 flex justify-between">
      <h2 class="items-baseline text-lg leading-6 font-medium text-gray-700">
        News from Law&Orga
      </h2>
    </div>
    <div class="mt-2 grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="article in articles"
        :key="article.id"
        class="flex flex-col justify-between rounded bg-white px-6 pt-4 pb-4 shadow"
      >
        <p class="text-end text-sm text-gray-500">
          {{ new Date(article.date).toLocaleDateString() }}
        </p>
        <div>
          <h3 class="mb-2 font-medium text-gray-700">
            {{ article.title }}
          </h3>
          <p
            class="[&>a]:text-formcolor text-sm wrap-break-word whitespace-pre-line text-gray-700 [&>a]:font-medium"
          >
            {{ article.preview }}
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
