<script setup lang="ts">
import LoMark from "./LoMark.vue";

const items = [
  {
    title: "Verschlüsselt gespeichert",
    text: "Vertrauliche Aktenfelder und Dateien werden mit AES-256 verschlüsselt gespeichert. Die Schlüssel sind an persönliche Accounts gebunden, Zugriff erhalten nur berechtigte Personen und Gruppen. Keine externe Schnittstelle bekommt Zugriff auf Fall- oder Ratsuchenden-Daten.",
  },
  {
    title: "Server in der EU",
    text: "Der Betrieb läuft auf ausgewählten Servern in der EU, ohne Cloud-Dienste von Drittanbietern für sensible Daten.",
  },
  {
    title: "Rechte pro Person und Gruppe",
    text: "Ihr legt fest, wer welche Akte, welchen Ordner und welchen Termin sehen oder bearbeiten darf.",
  },
  {
    title: "Zwei-Faktor-Authentifizierung",
    text: "Jeder Account lässt sich zusätzlich mit einem zweiten Faktor schützen.",
  },
  {
    title: "Offener Quellcode",
    text: "Der Code steht unter der AGPL 3.0 und ist vollständig einsehbar: Sicherheit, die ihr überprüfen könnt, und kein Vendor-Lock-in.",
  },
  {
    title: "DSGVO-konform",
    text: "Datensparsam gebaut. Die dokumentierten Maßnahmen nutzt ihr für eure eigene Datenschutz-Dokumentation.",
  },
  {
    title: "Barrierefreiheit",
    text: "Neue und bestehende Funktionen orientieren sich an WCAG 2.1 AA, BITV 2.0 und BFSG.",
  },
];
</script>

<template>
  <!-- overflow-clip (not hidden) clips the mark without breaking the sticky column -->
  <section id="sicherheit" class="bg-lo-mist relative overflow-clip">
    <LoMark
      fill="#D3E7EB"
      class="pointer-events-none absolute -bottom-[300px] -left-[220px] block size-[820px]"
    />
    <div
      class="relative mx-auto max-w-[1240px] px-5 py-[88px] sm:px-12 sm:py-36"
    >
      <div
        class="grid grid-cols-1 items-start gap-12 min-[981px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[981px]:gap-24"
      >
        <div class="min-[981px]:sticky min-[981px]:top-28">
          <h2
            class="text-lo-petrol m-0 text-[clamp(36px,3.8vw,52px)] leading-[1.05] font-extrabold tracking-[-0.035em]"
          >
            Datenschutz als Fundament
          </h2>
          <p class="mt-6 mb-0 text-[19px] text-[#1C3440]">
            In euren Akten stehen Fluchtgeschichten, Familienverhältnisse und
            Fristen. Die meisten Fallverwaltungen versprechen DSGVO-Konformität.
            Law&amp;Orga geht weiter: Verschlüsselung, Server in der EU und
            offener Quellcode.
          </p>
          <p class="mt-8 mb-0 flex flex-col items-start gap-3 text-[17px]">
            <router-link
              :to="{ name: 'internal-toms' }"
              class="text-lo-petrol font-bold"
            >
              Technische und organisatorische Maßnahmen lesen
            </router-link>
            <a
              href="https://github.com/lawandorga"
              class="text-lo-petrol font-bold"
            >
              Quellcode auf GitHub ansehen
            </a>
          </p>
        </div>
        <dl class="m-0 border-b border-[#A9C8CF]">
          <div
            v-for="item in items"
            :key="item.title"
            class="border-t border-[#A9C8CF] py-7"
          >
            <dt
              class="text-lo-petrol text-[23px] font-extrabold tracking-[-0.015em]"
            >
              {{ item.title }}
            </dt>
            <dd class="mx-0 mt-2 mb-0 max-w-[34em] text-[#1C3440]">
              {{ item.text }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
