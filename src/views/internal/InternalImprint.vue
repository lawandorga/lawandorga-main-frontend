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
      <h1>Impressum</h1>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div v-html="article.content"></div>
    </article>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import InternalService from "@/services/internal";
import { ImprintPage } from "@/types/internal";

export default defineComponent({
  setup() {
    const article = ref<ImprintPage | null>(null);

    onMounted(() =>
      InternalService.getImprintPage().then((item) => (article.value = item)),
    );

    return {
      article,
    };
  },
});
</script>
