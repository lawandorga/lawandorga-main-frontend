<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import { LCD_LOGO_URL } from "@/features/internal/utils/landing";

import LoMark from "./LoMark.vue";

const props = withDefaults(
  defineProps<{
    // prefix for the anchor links, e.g. "/start/" on other pages
    anchorBase?: string;
    loginUrl: string;
    isAuthenticated?: boolean;
  }>(),
  { anchorBase: "", isAuthenticated: false },
);

const menuItems = [
  { href: "#einblick", label: "Einblick" },
  { href: "#sicherheit", label: "Sicherheit" },
  { href: "#organisationen", label: "Für Organisationen" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#neuigkeiten", label: "Neuigkeiten" },
].map((item) => ({ ...item, href: `${props.anchorBase}${item.href}` }));

const menuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && menuOpen.value) {
    menuOpen.value = false;
    menuButton.value?.focus();
  }
};

onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<template>
  <header class="border-lo-line sticky top-0 z-40 border-b bg-white">
    <!-- sticky like most websites; useLandingMeta sets a matching scroll padding -->
    <div
      class="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-6 px-5 sm:px-12"
    >
      <div class="flex min-w-0 items-center gap-5">
        <a
          :href="`${anchorBase}#top`"
          aria-label="Law&Orga Startseite"
          class="text-lo-petrol flex items-center gap-2.5 no-underline"
        >
          <LoMark fill="#003C4D" class="block size-8" />
          <span class="text-[22px] font-extrabold tracking-[-0.02em]">
            Law&amp;Orga
          </span>
        </a>
        <span class="bg-lo-line hidden h-[30px] w-px sm:block"></span>
        <a
          :href="`${anchorBase}#traeger`"
          class="text-lo-muted hidden items-center gap-2.5 text-sm leading-tight no-underline sm:flex"
        >
          <span class="whitespace-nowrap">ein Projekt von</span>
          <img
            :src="LCD_LOGO_URL"
            alt="Law Clinics Deutschland e.V."
            class="block h-[30px] w-auto"
          />
        </a>
      </div>
      <nav aria-label="Hauptnavigation" class="flex items-center gap-8">
        <div class="hidden gap-8 text-base font-semibold min-[981px]:flex">
          <a
            v-for="item in menuItems"
            :key="item.href"
            :href="item.href"
            class="lo-navlink text-lo-text whitespace-nowrap"
          >
            {{ item.label }}
          </a>
        </div>
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'dashboard' }"
          lang="en"
          class="lo-btn lo-btn-primary min-h-11 px-[22px] text-base whitespace-nowrap"
        >
          Dashboard
        </router-link>
        <a
          v-else
          :href="loginUrl"
          lang="en"
          class="lo-btn lo-btn-primary min-h-11 px-[22px] text-base whitespace-nowrap"
        >
          Sign in
        </a>
        <button
          ref="menuButton"
          type="button"
          class="lo-btn lo-btn-ghost min-h-11 gap-2 px-[11px] text-base min-[981px]:hidden sm:px-3"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          @click="toggleMenu"
        >
          <svg
            v-if="menuOpen"
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#003C4D"
            stroke-width="2.4"
            stroke-linecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          <svg
            v-else
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#003C4D"
            stroke-width="2.4"
            stroke-linecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <span class="max-sm:sr-only">Menü</span>
        </button>
      </nav>
    </div>
    <nav
      v-show="menuOpen"
      id="mobile-menu"
      aria-label="Menü"
      class="border-lo-line border-t bg-white min-[981px]:hidden"
    >
      <ul class="m-0 list-none px-5 pt-2 pb-4">
        <li
          v-for="item in menuItems"
          :key="item.href"
          class="border-b border-[#E6EBEC]"
        >
          <a
            :href="item.href"
            class="lo-navlink text-lo-text flex min-h-[52px] items-center text-lg font-bold"
            @click="closeMenu"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>
