<script setup lang="ts">
import { LCD_WEBSITE_URL, mailto } from "@/features/internal/utils/landing";

import LoMark from "./LoMark.vue";

const teamMail = mailto();
</script>

<template>
  <footer class="lo-dark bg-lo-footer text-lo-on-dark relative overflow-hidden">
    <LoMark
      fill="#06394A"
      class="pointer-events-none absolute -top-[150px] -right-[120px] block size-[520px]"
    />
    <div
      class="relative mx-auto flex max-w-[1240px] flex-wrap justify-between gap-8 px-5 py-14 text-base sm:px-12"
    >
      <div class="max-w-[26em]">
        <span
          class="flex items-center gap-2.5 text-[19px] font-extrabold text-white"
        >
          <LoMark fill="#FFFFFF" class="block size-6" />
          Law&amp;Orga
        </span>
        <p lang="en" class="text-lo-accent mt-2.5 mb-0 font-bold">
          Legal Work. Organized.
        </p>
        <p class="mt-1.5 mb-0">
          Ein Projekt von
          <a :href="LCD_WEBSITE_URL" class="text-white" data-testid="lcd-link">
            Law Clinics Deutschland e.V.
          </a>
        </p>
      </div>
      <nav
        aria-label="Rechtliches und Kontakt"
        class="flex flex-wrap content-start gap-x-8 gap-y-3"
      >
        <router-link :to="{ name: 'internal-imprint' }" class="text-white">
          Impressum
        </router-link>
        <a
          href="http://rlc-deutschland.de/datenschutz/"
          rel="noopener"
          class="text-white"
        >
          Datenschutz
        </a>
        <router-link :to="{ name: 'internal-toms' }" class="text-white">
          TOMs
        </router-link>
        <a href="https://github.com/lawandorga" class="text-white">
          Open Source
        </a>
        <a :href="teamMail" class="text-white">team@law-orga.de</a>
      </nav>
    </div>
  </footer>
</template>
