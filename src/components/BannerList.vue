<template>
  <transition
    enter-active-class="transition duration-200 opacity-0"
    enter-class="opacity-0"
    enter-to-class="opacity-100"
    leave-class="opacity-100"
    leave-to-class="opacity-0"
    leave-active-class="transition duration-150"
  >
    <BannerWhite
      v-if="banner"
      :text="banner.text"
      :to="banner.to"
      :close="banner.close"
      :button="banner.button"
      @close="close()"
    />
  </transition>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { computed, ref, watch } from "vue";
import BannerWhite from "./BannerWhite.vue";
import { IArticle } from "@/types/internal";
import { RouteLocationRaw } from "vue-router";
import useClient from "@/api/client";

interface IBanner {
  text: string;
  to: RouteLocationRaw;
  button: string;
  close: boolean;
}

const loading = ref(true);

const banner = ref<IBanner>();

const userStore = useUserStore();

/*
// optimization banner
*/
const lastOptimization = userStore.getSetting("lastOptimization", 0) as number;

const isOptimizationDue =
  // optimization never ran for this user
  lastOptimization == 0 ||
  // optimization was more than 7 days ago
  new Date(lastOptimization + 0 * 1000 * 60 * 60 * 24 * 7) < new Date();

const optimizationBanner = {
  text: "Law&Orga would like to run some optimizations in order to fix key errors and more.",
  to: { name: "user-optimize" },
  button: "Run optimizations",
  close: false,
};

/*
// articles banner
*/
const articles = ref<IArticle[]>([]);

const client = useClient();
client
  .get("api/internal/articles/")()
  .then((result) => {
    articles.value = result;
    loading.value = false;
  });

const latestArticles = computed(() =>
  articles.value.filter((a) => {
    const date = new Date(a.date);
    date.setDate(date.getDate() + 14);
    return date > new Date();
  }),
);

const articleToBanner = (article: IArticle): IBanner => {
  return {
    text: `New article: ${article.title}`,
    to: { name: "internal-article", params: { id: article.id } },
    button: "Read more",
    close: true,
  };
};

/*
// banners
*/
const closedBanners = userStore.getSetting("closedBanners", []) as string[];

const banners = computed<IBanner[]>(() => {
  let l = [];
  if (isOptimizationDue) l.push(optimizationBanner);
  latestArticles.value.forEach((a) => l.push(articleToBanner(a)));
  l = l.filter((i) => !closedBanners.includes(i.text));
  return l;
});

watch(loading, () => {
  banner.value =
    banners.value[Math.floor(Math.random() * banners.value.length)];
});

const close = () => {
  if (!banner.value) return;
  closedBanners.push(banner.value.text);
  userStore.updateSetting("closedBanners", closedBanners);
  banner.value = undefined;
};
</script>
