<script lang="ts" setup>
import "@fontsource/aileron/400.css";
import "@fontsource/aileron/600.css";
import "@fontsource/aileron/700.css";
import "@fontsource/aileron/800.css";
import "@/features/internal/components/landing/landing.css";
import { computed } from "vue";

import { usePublicArticles } from "@/features/internal/api/usePublicArticles";
import LandingFooter from "@/features/internal/components/landing/LandingFooter.vue";
import LandingHeader from "@/features/internal/components/landing/LandingHeader.vue";
import { useLandingMeta } from "@/features/internal/composables/useLandingMeta";
import { formatLandingDate } from "@/features/internal/utils/landing";
import { useUserStore } from "@/store/user";
import { getRawLoginUrl } from "@/utils/login";

useLandingMeta("Neuigkeiten – Law&Orga");

const userStore = useUserStore();
const { articles } = usePublicArticles();

const loginUrl = `${getRawLoginUrl()}?next=${window.location.origin}/dashboard/`;
const loaded = computed(() => articles.value !== null);
</script>

<template>
  <div class="lo" lang="de">
    <a class="lo-skip" href="#inhalt">Zum Inhalt springen</a>
    <LandingHeader
      anchor-base="/start/"
      :login-url="loginUrl"
      :is-authenticated="userStore.isAuthenticated"
    />
    <main id="inhalt" tabindex="-1" class="outline-none">
      <div class="mx-auto max-w-[1240px] px-5 py-[72px] sm:px-12 sm:py-[120px]">
        <p class="m-0 text-base">
          <router-link :to="{ name: 'start' }" class="text-lo-petrol font-bold">
            Zur Startseite
          </router-link>
        </p>
        <h1
          class="text-lo-petrol mt-6 mb-0 text-[clamp(36px,3.8vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em]"
        >
          Neuigkeiten
        </h1>
        <p
          v-if="loaded && !articles?.length"
          class="text-lo-text-2 mt-10 mb-0 text-lg"
        >
          Zurzeit gibt es keine Neuigkeiten.
        </p>
        <div class="mt-10 max-w-[52em]">
          <article
            v-for="article in articles ?? []"
            :key="article.id"
            class="border-lo-line-2 border-t pt-5 pb-7 last:border-b"
          >
            <time :datetime="article.date" class="text-lo-muted text-[15px]">
              {{ formatLandingDate(article.date) }}
            </time>
            <h2
              class="mt-1.5 mb-0 text-[23px] leading-[1.3] font-bold tracking-[-0.01em]"
            >
              <router-link
                :to="{ name: 'internal-article', params: { id: article.id } }"
                class="text-lo-text hover:decoration-lo-accent no-underline hover:underline hover:decoration-2"
              >
                {{ article.title }}
              </router-link>
            </h2>
            <p class="text-lo-muted mt-1.5 mb-0 text-[17px]">
              {{ article.preview }}
            </p>
          </article>
        </div>
      </div>
    </main>
    <LandingFooter />
  </div>
</template>
