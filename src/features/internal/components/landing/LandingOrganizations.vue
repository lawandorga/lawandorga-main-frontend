<script setup lang="ts">
import { MAIL_SUBJECTS, mailto } from "@/features/internal/utils/landing";

const steps = [
  {
    number: 1,
    title: "Kennenlernen",
    text: "Ein unverbindliches Gespräch, auf Wunsch mit Vorstellung von Law&Orga und einem Demo-Zugang.",
  },
  {
    number: 2,
    title: "Beitrag klären",
    text: "Für Law Clinics ist Law&Orga kostenfrei. Andere Organisationen vereinbaren mit uns einen solidarischen Beitrag nach Größe und Ressourcen.",
  },
  {
    number: 3,
    title: "Onboarding",
    text: "Wir richten eure Organisation ein, arbeiten euer Team ein und bleiben ansprechbar. Eure Mitglieder registrieren sich, eure Admins schalten sie frei.",
  },
];

const organizationMail = mailto(MAIL_SUBJECTS.organization);
</script>

<template>
  <section id="organisationen" class="bg-white">
    <div class="mx-auto max-w-[1240px] px-5 py-[88px] sm:px-12 sm:py-36">
      <div
        class="grid grid-cols-1 items-start gap-12 min-[981px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[981px]:gap-24"
        data-anchor
      >
        <div>
          <h2
            class="text-lo-petrol m-0 text-[clamp(36px,3.8vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em]"
          >
            Für eure Organisation
          </h2>
          <p class="text-lo-text-2 mt-6 mb-0 text-[19px]">
            Law&amp;Orga ist 2018 für die ehrenamtliche, studentische
            Rechtsberatung der Law Clinics entstanden. Heute steht es auch
            weiteren Beratungs- und Hilfsorganisationen offen, die mit
            wechselnden, oft ehrenamtlichen Teams arbeiten und mit sensiblen
            Daten umgehen.
          </p>
          <div class="mt-9 flex flex-col items-start gap-4">
            <a
              :href="organizationMail"
              class="lo-btn lo-btn-primary min-h-[52px] px-[26px]"
            >
              team@law-orga.de schreiben
            </a>
          </div>
        </div>
        <ol class="border-lo-line-2 m-0 list-none border-b p-0">
          <li
            v-for="step in steps"
            :key="step.number"
            class="border-lo-line-2 grid grid-cols-[56px_minmax(0,1fr)] items-baseline gap-4 border-t py-8 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-6"
          >
            <span
              aria-hidden="true"
              class="text-lo-petrol text-[64px] leading-[0.9] font-extrabold tracking-[-0.04em]"
            >
              {{ step.number }}
            </span>
            <span>
              <span class="block text-2xl font-extrabold tracking-[-0.015em]">
                {{ step.title }}
              </span>
              <span class="text-lo-text-2 mt-2 block">{{ step.text }}</span>
            </span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
