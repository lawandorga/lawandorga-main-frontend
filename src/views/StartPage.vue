<script lang="ts" setup>
import { ButtonNormal } from "lorga-ui";
import { formatDate } from "@/utils/date";
import { useUserStore } from "@/store/user";
import { computed } from "vue";
import { getRawLoginUrl, getRegisterUrl } from "@/utils/login";
import {
  useLoginPage,
  LoginPage,
  RoadmapItem,
} from "@/features/internal/api/useLoginPage";

const getLoginUrl = () => {
  const loginUrl = getRawLoginUrl();
  const origin = window.location.origin;
  const next = "/dashboard/";
  return `${loginUrl}?next=${origin}${next}`;
};

const sponsors = [
  {
    name: "CMS Stiftung",
    image: "/sponsor-cms.jpg",
    type: "MAIN",
    class: "",
  },
  {
    name: "Prototype Fund",
    image: "/sponsor-p.png",
    type: "FORMER",
    class: "p-2",
  },
  {
    name: "Deutsche Stiftung für Engagement und Ehrenamt",
    image: "/sponsor-dse.png",
    type: "CURRENT",
    class: "px-4",
  },
  {
    name: "Bundesministerium für Bildung und Forschung",
    image: "/sponsor-bmbf.png",
    type: "FORMER",
    class: "px-2 py-1",
  },
  {
    name: "Robert Bosch Stiftung",
    image: "/sponsor-rbs.png",
    type: "FORMER",
    class: "px-2 py-1",
  },
  {
    name: "Google Impact Challenge",
    image: "/sponsor-google.png",
    type: "FORMER",
    class: "",
  },
];

const sponsorGroups = [
  { name: "Main Sponsor", type: "MAIN", class: "" },
  { name: "Current Sponsors", type: "CURRENT", class: "" },
  { name: "Former Sponsors", type: "FORMER", class: "w-full" },
];

const userStore = useUserStore();

const { page } = useLoginPage();

const roadmapItems = computed<RoadmapItem[]>(() => {
  if (!page.value) return [];
  return page.value.roadmap_items;
});

const articles = computed<LoginPage["articles"]>(() => {
  if (!page.value) return [];
  return page.value.articles;
});

const passwordForgottenLink = `${
  import.meta.env.VITE_AUTH_URL
}/auth/user/password_reset/`;
</script>

<template>
  <main class="divide-y divide-gray-100">
    <section class="px-8 py-8 mx-auto bg-formcolor max-w-7xl">
      <div class="max-w-7xl">
        <div class="grid gap-6 lg:grid-cols-2">
          <div class="">
            <div>
              <h1
                class="m-0 text-4xl font-extrabold tracking-tight text-white sm:leading-none lg:text-5xl xl:text-6xl"
              >
                <div class="flex flex-wrap items-center space-x-5">
                  <div class="flex items-center space-x-3">
                    <img
                      src="/logo.svg"
                      alt="Law&Orga Logo"
                      class="w-16 h-16"
                    />
                    <span class="md:block">Law&Orga</span>
                  </div>
                  <div class="bg-gray-200 w-0.5 h-16"></div>
                  <img
                    src="/sponsor-cms.jpg"
                    alt="CMS Stiftung"
                    class="w-40 h-auto overflow-hidden rounded"
                  />
                </div>
              </h1>
              <p class="mt-3 text-base text-gray-200 sm:mt-5 sm:text-xl">
                <b>Law&Orga</b>
                ist ein
                <b>kostenfreies Akten- und Organisationsverwaltungssystem</b>
                <span>,</span>
                welches speziell auf die Bedürfnisse einer (R)LC angepasst ist.
              </p>
              <p class="mt-3 text-base text-gray-200 sm:mt-5">
                Unter besonderer Berücksichtigung des Datenschutzes mithilfe von
                Berechtigungssystemen für die Nutzer und einer komplexen
                Verschlüsselung auf der technischen Seite ermöglicht die
                Aktenverwaltungskomponente das Erstellen, die Durchsuchung, die
                Verwaltung und die Vereinheitlichung von Akten. Durch die
                Organisationsverwaltungsfunktion können Ressorts/Arbeitsgruppen
                erstellt und koordiniert werden. Mithilfe einer
                Dateiverwaltungsfunktion können die Dateien übersichtlich und
                datenschutzkonform bei Law&Orga gespeichert werden.
              </p>
            </div>
          </div>
          <div class="flex flex-col justify-center">
            <div class="p-6 bg-white rounded-sm shadow-sm">
              <h2 class="mb-8 text-2xl font-bold">Login</h2>
              <p v-if="false">We're running updates. We'll be back shortly!</p>
              <div v-else-if="!userStore.isAuthenticated">
                <ButtonNormal :href="getLoginUrl()">
                  To the login page
                </ButtonNormal>
                <div class="pt-6 space-x-4 text-right">
                  <a
                    :href="getRegisterUrl()"
                    class="inline-block hover:underline"
                  >
                    Register
                  </a>
                  <a
                    :href="passwordForgottenLink"
                    class="inline-block hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              </div>
              <div v-else>
                <p class="mb-4">You are logged in already.</p>
                <ButtonNormal :to="{ name: 'dashboard' }">
                  To the dashboard
                </ButtonNormal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
      <div
        class="relative max-w-lg mx-auto divide-y-2 divide-gray-200 lg:max-w-7xl"
      >
        <!-- eslint-disable vue/no-v-html -->
        <article
          v-if="page"
          class="prose prose-lg"
          v-html="page.content"
        ></article>
      </div>
    </section>

    <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
      <div class="relative max-w-lg mx-auto lg:max-w-7xl">
        <div>
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            More News
          </h2>
        </div>
        <div class="grid gap-16 pt-10 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
          <div v-for="article in articles" :key="article.id">
            <p class="text-sm text-gray-500">
              <time>{{ formatDate(article.date) }}</time>
            </p>
            <router-link
              :to="{ name: 'internal-article', params: { id: article.id } }"
              class="block mt-2"
            >
              <p class="text-xl font-semibold text-gray-900">
                {{ article.title }}
              </p>
              <p class="mt-3 text-base text-gray-500 line-clamp-3">
                {{ article.description }}
              </p>
            </router-link>
            <div class="mt-3">
              <router-link
                :to="{ name: 'internal-article', params: { id: article.id } }"
                class="text-base font-semibold text-formcolor"
              >
                Read full article
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
      <div class="relative max-w-lg mx-auto lg:max-w-7xl">
        <div>
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Roadmap
          </h2>
        </div>
        <div class="pt-10">
          <div class="max-w-2xl">
            <ul class="divide-y divide-gray-200">
              <li v-for="item in roadmapItems" :key="item.id" class="py-4">
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <h3 class="text-sm font-semibold">
                      {{ item.title }}
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ item.date }}
                    </p>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ item.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
      <div class="relative max-w-lg mx-auto lg:max-w-7xl">
        <div class="mb-6">
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            Sponsors
          </h2>
        </div>
        <div class="flex flex-wrap justify-start -mx-6 -my-2">
          <div
            v-for="group in sponsorGroups"
            :key="group.name"
            class="px-6 py-2"
            :class="[group.class]"
          >
            <h3 class="mb-4 text-xl font-bold tracking-tight text-gray-900">
              {{ group.name }}
            </h3>
            <ul class="flex flex-wrap justify-start -m-3">
              <li
                v-for="sponsor in sponsors.filter(
                  (item) => item.type === group.type,
                )"
                :key="sponsor.name"
                class="block lg:max-w-[17rem] p-3"
              >
                <figure>
                  <img
                    :src="sponsor.image"
                    :alt="sponsor.name"
                    class="mx-auto w-auto max-h-[5rem] rounded-md overflow-hidden border-2 border-gray-300 shadow"
                    :class="[sponsor.class]"
                  />
                  <figcaption class="mt-2 text-sm text-center text-gray-500">
                    {{ sponsor.name }}
                  </figcaption>
                </figure>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="px-8 py-12 mx-auto bg-white max-w-7xl">
      <div class="space-x-4 text-right">
        <a href="https://github.com/lawandorga" rel="noopener" target="_blank">
          Open Source Code
        </a>
        <router-link :to="{ name: 'internal-imprint' }">Imprint</router-link>
        <a
          target="_blank"
          rel="noopener"
          href="http://rlc-deutschland.de/datenschutz/"
        >
          Privacy
        </a>
        <router-link :to="{ name: 'internal-toms' }">TOMS</router-link>
      </div>
    </section>
  </main>
</template>
