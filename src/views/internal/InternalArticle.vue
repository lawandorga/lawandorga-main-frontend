<template>
  <section
    class="px-8 py-4 mx-auto bg-white border-b border-gray-100 max-w-7xl"
  >
    <router-link
      class="text-lg font-medium text-lorgablue"
      :to="{ name: 'start' }"
    >
      &#x21b5; Back
    </router-link>
  </section>
  <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
    <article v-if="article" class="mx-auto prose prose-lg">
      <em>{{ formatDate(article.date) }}</em>
      <h1>{{ article.title }}</h1>
      <p class="lead">{{ article.description }}</p>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content"></div>
      <small v-if="article.author" class="block pt-6 text-right">
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
