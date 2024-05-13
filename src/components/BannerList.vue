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
      @close="banner?.onClose"
    />
  </transition>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user";
import { ref } from "vue";
import BannerWhite from "./BannerWhite.vue";
import { RouteLocationRaw } from "vue-router";
import { useRunOptimizations } from "@/features/user/api/useRunOptimizations";

interface Banner {
  text: string;
  to: RouteLocationRaw;
  button: string;
  close: boolean;
  onClose: () => void;
}

const { runAll } = useRunOptimizations();

const banner = ref<Banner>();

const userStore = useUserStore();

const lastOptimization = userStore.getSetting("lastOptimization", 0) as number;

const isOptimizationDue =
  // optimization never ran for this user
  lastOptimization == 0 ||
  // optimization was more than 7 days ago
  new Date(lastOptimization + 1000 * 60 * 60 * 24 * 7) < new Date();

const optimizationBanner = {
  text: "Law&Orga would like to run some optimizations in order to fix key errors and more.",
  to: { name: "user-optimize" },
  button: "Run optimizations",
  close: true,
  onClose: () => {
    runAll();
    banner.value = undefined;
  },
};

if (isOptimizationDue) {
  banner.value = optimizationBanner;
}
</script>
