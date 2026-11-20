<script setup lang="ts">
import {
  LCD_LOGO_URL,
  MAIL_SUBJECTS,
  mailto,
} from "@/features/internal/utils/landing";

const supportMail = mailto(MAIL_SUBJECTS.support);

const sponsors = [
  { name: "CMS Stiftung", image: "/sponsor-cms.jpg", height: "h-[38px]" },
  {
    name: "Deutsche Stiftung für Engagement und Ehrenamt",
    image: "/sponsor-dse.png",
    height: "h-[42px]",
  },
  { name: "Prototype Fund", image: "/sponsor-p.png", height: "h-[52px]" },
  {
    name: "Bundesministerium für Bildung und Forschung",
    image: "/sponsor-bmbf.png",
    height: "h-14",
  },
  { name: "Robert Bosch Stiftung", image: "/sponsor-rbs.png", height: "h-10" },
  {
    name: "Google Impact Challenge",
    image: "/sponsor-google.png",
    height: "h-[60px]",
  },
];
</script>

<template>
  <section id="traeger" class="border-lo-line bg-lo-neutral border-t">
    <div class="mx-auto max-w-[1240px] px-5 py-[88px] sm:px-12 sm:py-[120px]">
      <div
        class="grid grid-cols-1 items-start gap-12 min-[981px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[981px]:gap-24"
      >
        <div>
          <img
            :src="LCD_LOGO_URL"
            alt="Law Clinics Deutschland e.V."
            class="block h-auto w-80 max-w-full"
          />
        </div>
        <div>
          <h2
            class="text-lo-petrol m-0 text-[clamp(30px,2.8vw,40px)] leading-[1.1] font-extrabold tracking-[-0.03em]"
          >
            Gemeinsam getragen
          </h2>
          <p class="text-lo-text-2 mt-5 mb-0 text-[19px]">
            Law&amp;Orga ist ein Projekt von Law Clinics Deutschland e.V., dem
            Dachverband der Law Clinics in Deutschland. Für Law Clinics bleibt
            es dauerhaft kostenfrei. Ihr Beitrag ist freiwillig, keine Law
            Clinic verliert den Zugang.
          </p>
          <p class="text-lo-text-2 mt-4 mb-0 text-[19px]">
            Andere gemeinnützige Organisationen beteiligen sich solidarisch
            statt über Lizenzgebühren: Wer mehr Möglichkeiten hat, trägt mehr
            bei. Wer weniger hat, wird nicht überfordert.
            <span lang="en">We don’t want to get rich.</span>
            Überschüsse fließen in Law&amp;Orga und weitere gemeinnützige
            Projekte des Dachverbands.
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              :href="supportMail"
              class="lo-btn lo-btn-outline min-h-[50px] px-6"
            >
              Law&amp;Orga unterstützen
            </a>
            <span class="text-lo-muted text-[15px]">
              oder direkt an
              <a :href="supportMail" class="text-lo-petrol font-bold">
                team@law-orga.de
              </a>
            </span>
            <a
              href="https://github.com/lawandorga"
              class="text-lo-petrol font-bold"
            >
              Mitentwickeln auf GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section
    aria-labelledby="foerderer"
    class="border-t border-[#E6EBEC] bg-white"
  >
    <div class="mx-auto max-w-[1240px] px-5 pt-[72px] pb-20 sm:px-12">
      <h2 id="foerderer" class="text-lo-text-2 m-0 text-lg font-bold">
        Bisher gefördert von
      </h2>
      <ul
        class="m-0 mt-8 flex list-none flex-wrap items-center gap-x-14 gap-y-8 p-0"
      >
        <li v-for="sponsor in sponsors" :key="sponsor.name">
          <img
            :src="sponsor.image"
            :alt="sponsor.name"
            class="block w-auto"
            :class="sponsor.height"
          />
        </li>
      </ul>
    </div>
  </section>
</template>
