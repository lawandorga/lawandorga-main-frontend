<script lang="ts" setup>
import "@fontsource/aileron/400.css";
import "@fontsource/aileron/600.css";
import "@fontsource/aileron/700.css";
import "@fontsource/aileron/800.css";
import "@/features/internal/components/landing/landing.css";
import { computed, nextTick, watch } from "vue";

import { useLoginPage } from "@/features/internal/api/useLoginPage";
import LandingFooter from "@/features/internal/components/landing/LandingFooter.vue";
import LandingHeader from "@/features/internal/components/landing/LandingHeader.vue";
import LandingHero from "@/features/internal/components/landing/LandingHero.vue";
import LandingMore from "@/features/internal/components/landing/LandingMore.vue";
import LandingNews from "@/features/internal/components/landing/LandingNews.vue";
import LandingOrganizations from "@/features/internal/components/landing/LandingOrganizations.vue";
import LandingRoadmap from "@/features/internal/components/landing/LandingRoadmap.vue";
import LandingSecurity from "@/features/internal/components/landing/LandingSecurity.vue";
import LandingShowroom from "@/features/internal/components/landing/LandingShowroom.vue";
import LandingSupport from "@/features/internal/components/landing/LandingSupport.vue";
import { useLandingMeta } from "@/features/internal/composables/useLandingMeta";
import { markLandingReady } from "@/features/internal/utils/scroll";
import { useUserStore } from "@/store/user";
import { getRawLoginUrl, getRegisterUrl } from "@/utils/login";

useLandingMeta();

const userStore = useUserStore();
const { page } = useLoginPage();

const loginUrl = `${getRawLoginUrl()}?next=${window.location.origin}/dashboard/`;
const registerUrl = getRegisterUrl();
const passwordResetUrl = `${import.meta.env.VITE_AUTH_URL}/auth/user/password_reset/`;

// the api only returns published content, no filtering needed here
// optional chaining also keeps the page working against an older backend
// that does not return feature_areas or the new roadmap fields yet
const showroomAreas = computed(
  () =>
    page.value?.feature_areas?.filter((a) => a.placement === "showroom") ?? [],
);
const moreAreas = computed(
  () => page.value?.feature_areas?.filter((a) => a.placement === "more") ?? [],
);
const roadmapItems = computed(() =>
  (page.value?.roadmap_items ?? []).map((item) => ({
    ...item,
    benefits: item.benefits ?? [],
  })),
);
const articles = computed(() => page.value?.articles ?? []);

// anchor links (e.g. /start/#roadmap) wait until the content is rendered,
// because it changes the height of the page
watch(
  page,
  (value) => {
    if (value) nextTick(markLandingReady);
  },
  { immediate: true },
);
</script>

<template>
  <div class="lo" lang="de">
    <a class="lo-skip" href="#inhalt">Zum Inhalt springen</a>
    <LandingHeader
      :login-url="loginUrl"
      :is-authenticated="userStore.isAuthenticated"
      spy
    />

    <main id="inhalt" tabindex="-1" class="outline-none">
      <LandingHero
        :login-url="loginUrl"
        :register-url="registerUrl"
        :password-reset-url="passwordResetUrl"
        :is-authenticated="userStore.isAuthenticated"
      />

      <section id="einblick" class="bg-white">
        <div
          class="mx-auto max-w-[1240px] px-5 pt-[88px] pb-24 sm:px-12 sm:pt-36"
        >
          <div class="max-w-[36em]" data-anchor>
            <h2
              class="text-lo-petrol m-0 text-[clamp(36px,3.8vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em]"
            >
              So arbeitet ihr mit Law&amp;Orga
            </h2>
            <p class="text-lo-text-2 mt-5 mb-0 text-[19px]">
              Scrollt weiter. Das Fenster zeigt jeweils den Bereich, über den
              ihr gerade lest.
            </p>
          </div>
          <LandingShowroom :areas="showroomAreas" />
          <LandingMore :areas="moreAreas" />
        </div>
      </section>

      <LandingSecurity />
      <LandingOrganizations />
      <LandingRoadmap :items="roadmapItems" />
      <LandingNews :articles="articles" />
      <LandingSupport />
    </main>

    <LandingFooter />
  </div>
</template>
