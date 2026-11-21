<script lang="ts" setup>
import "@/features/internal/components/landing/landing.css";
import { computed } from "vue";

import { useLoginPage } from "@/features/internal/api/useLoginPage";
import LandingFooter from "@/features/internal/components/landing/LandingFooter.vue";
import LandingHero from "@/features/internal/components/landing/LandingHero.vue";
import LandingMore from "@/features/internal/components/landing/LandingMore.vue";
import LandingNews, {
  type ArticleTeaser,
} from "@/features/internal/components/landing/LandingNews.vue";
import LandingOrganizations from "@/features/internal/components/landing/LandingOrganizations.vue";
import LandingSecurity from "@/features/internal/components/landing/LandingSecurity.vue";
import LandingShowroom from "@/features/internal/components/landing/LandingShowroom.vue";
import LandingSupport from "@/features/internal/components/landing/LandingSupport.vue";
import { useLandingMeta } from "@/features/internal/composables/useLandingMeta";
import {
  MORE_AREAS,
  SHOWROOM_AREAS,
} from "@/features/internal/content/landingContent";
import { useUserStore } from "@/store/user";
import { getRawLoginUrl, getRegisterUrl } from "@/utils/login";

useLandingMeta();

const userStore = useUserStore();
const { page } = useLoginPage();

const loginUrl = `${getRawLoginUrl()}?next=${window.location.origin}/dashboard/`;
const registerUrl = getRegisterUrl();
const passwordResetUrl = `${import.meta.env.VITE_AUTH_URL}/auth/user/password_reset/`;

const articles = computed(
  () => (page.value?.articles ?? []) as unknown as ArticleTeaser[],
);
</script>

<template>
  <div class="lo -mx-6 -my-6" lang="de">
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
        <div class="max-w-[36em]">
          <h2
            class="text-lo-petrol m-0 text-[clamp(36px,3.8vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em]"
          >
            So arbeitet ihr mit Law&amp;Orga
          </h2>
          <p class="text-lo-text-2 mt-5 mb-0 text-[19px]">
            Von der Aktenliste bis zur Statistik: So sieht der Arbeitsalltag in
            Law&amp;Orga aus. Das Bild wechselt beim Weiterlesen mit.
          </p>
        </div>
        <LandingShowroom :areas="SHOWROOM_AREAS" />
        <LandingMore :areas="MORE_AREAS" />
      </div>
    </section>

    <LandingSecurity />
    <LandingOrganizations />
    <LandingNews :articles="articles" />
    <LandingSupport />
    <LandingFooter />
  </div>
</template>
