<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

import NavigationDropdown from "@/components/NavigationDropdown.vue";
import {
  LCD_LOGO_URL,
  LCD_WEBSITE_URL,
} from "@/features/internal/utils/landing";
import { getRegisterUrl } from "@/utils/login";

import LoMark from "./LoMark.vue";

defineProps<{ loginUrl: string; isAuthenticated: boolean }>();

const sections = [
  { id: "einblick", label: "Einblick" },
  { id: "sicherheit", label: "Sicherheit" },
  { id: "organisationen", label: "Für Organisationen" },
  { id: "neuigkeiten", label: "Neuigkeiten" },
];

const registerUrl = getRegisterUrl();
const visibleSectionId = ref<string>();
const menuOpen = ref(false);
const menuButton = ref<HTMLButtonElement | null>(null);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry) => (visibleSectionId.value = entry.target.id));
  },
  { rootMargin: "-40% 0px -59% 0px" },
);

const closeMenuOnEscape = (event: KeyboardEvent) => {
  if (event.key !== "Escape" || !menuOpen.value) return;
  menuOpen.value = false;
  menuButton.value?.focus();
};

onMounted(() => {
  document
    .querySelectorAll(".lo section[id]")
    .forEach((section) => sectionObserver.observe(section));
  document.addEventListener("keydown", closeMenuOnEscape);
});

onBeforeUnmount(() => {
  sectionObserver.disconnect();
  document.removeEventListener("keydown", closeMenuOnEscape);
});

const plainLinkClass =
  "text-lo-text no-underline hover:text-lo-petrol hover:underline hover:decoration-lo-accent hover:decoration-2";

const sectionLinkClass = (id: string) =>
  id === visibleSectionId.value
    ? "text-lo-petrol underline decoration-lo-petrol decoration-[3px]"
    : plainLinkClass;
</script>

<template>
  <header class="border-lo-line sticky top-0 z-[9] border-b bg-white">
    <div
      class="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-5 sm:gap-6 sm:px-12"
    >
      <div class="flex min-w-0 items-center gap-5">
        <a
          href="#top"
          aria-label="Law&Orga Startseite"
          class="text-lo-petrol flex items-center gap-2.5 no-underline"
        >
          <LoMark fill="#003C4D" class="block size-8" />
          <span
            class="text-[22px] font-extrabold tracking-[-0.02em] max-[379px]:sr-only"
          >
            Law&amp;Orga
          </span>
        </a>
        <span class="bg-lo-line hidden h-[30px] w-px min-[1440px]:block"></span>
        <a
          :href="LCD_WEBSITE_URL"
          class="text-lo-muted hidden items-center gap-2.5 text-sm leading-tight no-underline min-[1440px]:flex"
          data-testid="lcd-link"
        >
          <span class="whitespace-nowrap">ein Projekt von</span>
          <img
            :src="LCD_LOGO_URL"
            alt="Law Clinics Deutschland e.V."
            class="block h-[30px] w-auto"
          />
        </a>
      </div>
      <nav
        aria-label="Hauptnavigation"
        class="flex items-center gap-3 sm:gap-6"
      >
        <div
          class="hidden gap-6 text-base font-semibold min-[1180px]:flex"
          data-testid="section-links"
        >
          <a
            v-for="section in sections"
            :key="section.id"
            :href="`#${section.id}`"
            :aria-current="
              section.id === visibleSectionId ? 'location' : undefined
            "
            class="whitespace-nowrap underline-offset-8"
            :class="sectionLinkClass(section.id)"
          >
            {{ section.label }}
          </a>
        </div>
        <div
          v-if="!isAuthenticated"
          lang="en"
          class="hidden gap-6 text-base font-semibold min-[1180px]:flex"
          data-testid="account-links"
        >
          <router-link
            :to="{ name: 'records-upload' }"
            class="whitespace-nowrap underline-offset-8"
            :class="plainLinkClass"
          >
            Records Upload
          </router-link>
          <a
            :href="registerUrl"
            class="whitespace-nowrap underline-offset-8"
            :class="plainLinkClass"
          >
            Register
          </a>
        </div>
        <router-link
          v-if="isAuthenticated"
          :to="{ name: 'dashboard' }"
          lang="en"
          class="lo-btn lo-btn-primary min-h-11 px-4 text-base whitespace-nowrap sm:px-[22px]"
        >
          Dashboard
        </router-link>
        <a
          v-else
          :href="loginUrl"
          lang="en"
          class="lo-btn lo-btn-primary min-h-11 px-4 text-base whitespace-nowrap sm:px-[22px]"
        >
          Sign in
        </a>
        <NavigationDropdown
          v-if="isAuthenticated"
          lang="en"
          class="[&_a]:no-underline"
        />
        <button
          ref="menuButton"
          type="button"
          class="lo-btn border-lo-petrol text-lo-petrol hover:bg-lo-mist min-h-11 gap-2 border-[1.5px] bg-transparent px-[11px] text-base min-[1180px]:hidden sm:px-3"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#003C4D"
            stroke-width="2.4"
            stroke-linecap="round"
          >
            <path
              :d="menuOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'"
            />
          </svg>
          <span class="max-sm:sr-only">Menü</span>
        </button>
      </nav>
    </div>
    <nav
      v-show="menuOpen"
      id="mobile-menu"
      aria-label="Menü"
      class="border-lo-line border-t bg-white min-[1180px]:hidden"
    >
      <ul class="m-0 list-none px-5 pt-2 pb-4">
        <li
          v-for="section in sections"
          :key="section.id"
          class="border-b border-[#E6EBEC]"
        >
          <a
            :href="`#${section.id}`"
            :aria-current="
              section.id === visibleSectionId ? 'location' : undefined
            "
            class="flex min-h-[52px] items-center text-lg font-bold underline-offset-8"
            :class="sectionLinkClass(section.id)"
            @click="menuOpen = false"
          >
            {{ section.label }}
          </a>
        </li>
        <template v-if="!isAuthenticated">
          <li lang="en" class="border-b border-[#E6EBEC]">
            <router-link
              :to="{ name: 'records-upload' }"
              class="flex min-h-[52px] items-center text-lg font-semibold underline-offset-8"
              :class="plainLinkClass"
            >
              Records Upload
            </router-link>
          </li>
          <li lang="en">
            <a
              :href="registerUrl"
              class="flex min-h-[52px] items-center text-lg font-semibold underline-offset-8"
              :class="plainLinkClass"
            >
              Register
            </a>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>
