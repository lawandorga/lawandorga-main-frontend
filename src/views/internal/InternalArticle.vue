<template>
  <section
    class="bg-white mx-auto max-w-7xl py-4 px-8 border-b border-gray-100"
  >
    <router-link
      class="text-lg font-medium text-lorgablue"
      :to="{ name: 'user-login' }"
    >
      &#x21b5; Back
    </router-link>
  </section>
  <section class="bg-white mx-auto max-w-7xl py-12 px-8">
    <article v-if="article" class="prose prose-lg mx-auto">
      <em>{{ formatDate(article.date) }}</em>
      <h1>{{ article.title }}</h1>
      <p class="lead">{{ article.description }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content"></div>
      <small v-if="article.author" class="text-right block pt-6">
        Author: {{ article.author }}
      </small>
    </article>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import InternalService from "@/services/internal";
import { useRoute } from "vue-router";
import { Article } from "@/types/internal";
import { formatDate } from "@/utils/date";

export default defineComponent({
  setup() {
    const article = ref<Article | null>(null);
    const route = useRoute();

    onMounted(() =>
      InternalService.getArticle(route.params.id as string).then(
        (item) => (article.value = item),
      ),
    );

    return {
      article,
      formatDate,
    };
  },
});
</script>
