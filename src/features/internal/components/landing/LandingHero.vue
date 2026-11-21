<script setup lang="ts">
import LoMark from "./LoMark.vue";

defineProps<{
  loginUrl: string;
  registerUrl: string;
  passwordResetUrl: string;
  isAuthenticated: boolean;
}>();
</script>

<template>
  <section
    id="top"
    class="lo-dark bg-lo-petrol relative overflow-hidden text-white"
  >
    <div
      class="relative mx-auto max-w-[1240px] px-5 pt-10 pb-[72px] sm:px-12 sm:pt-12 sm:pb-32"
    >
      <div
        class="grid grid-cols-1 items-end gap-12 min-[981px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[981px]:gap-20"
      >
        <div class="relative z-[1]">
          <h1
            lang="en"
            class="m-0 text-[clamp(56px,7.4vw,108px)] leading-[0.94] font-extrabold tracking-[-0.045em]"
          >
            Legal Work.
            <span class="text-lo-accent block">Organized.</span>
          </h1>
          <p
            class="mt-10 mb-0 max-w-[30em] text-[21px] leading-normal text-[#E8F3F5]"
          >
            Sichere Fallverwaltung und professionelles Projektmanagement für Law
            Clinics, Beratungs- und Hilfsorganisationen: Akten, Aufgaben,
            Termine und Chat an einem Ort. Verschlüsselt, auf Servern in der EU,
            quelloffen.
          </p>
          <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#einblick"
              class="lo-btn lo-btn-white min-h-[52px] px-[26px]"
            >
              Law&amp;Orga ansehen
            </a>
            <a href="#organisationen" class="font-bold text-white">
              Für eure Organisation anfragen
            </a>
          </div>
          <p class="text-lo-on-dark-muted mt-16 mb-0 max-w-[34em] text-base">
            Seit 2018 im Einsatz: rund 70 Organisationen, 800 bis 1.000 aktive
            Nutzer:innen pro Monat und über 20.300 angelegte Akten (Stand
            11/2026). Für Law Clinics dauerhaft kostenfrei und solidarisch
            mitgetragen: Wer kann, unterstützt mit einem
            <a href="#traeger" class="font-bold text-white">
              freiwilligen Beitrag</a
            >.
          </p>
        </div>

        <div class="relative">
          <!-- large mark shape: behind the card, never behind text -->
          <LoMark
            fill="#0B4D60"
            class="pointer-events-none absolute -bottom-[260px] -left-10 z-0 block size-[620px] min-[981px]:top-1/2 min-[981px]:bottom-auto min-[981px]:-left-[50px] min-[981px]:size-[900px] min-[981px]:-translate-y-1/2"
          />
          <div
            lang="en"
            class="text-lo-text relative rounded-xl bg-white p-6 shadow-[0_28px_56px_-28px_rgba(0,18,24,0.7)] sm:p-10"
          >
            <template v-if="isAuthenticated">
              <h2
                class="text-lo-petrol m-0 text-[28px] leading-tight font-extrabold tracking-[-0.025em]"
              >
                You are signed in
              </h2>
              <p class="text-lo-muted mt-2.5 mb-0 text-base">
                Continue where you left off.
              </p>
              <router-link
                :to="{ name: 'dashboard' }"
                class="lo-btn lo-btn-primary mt-7 flex min-h-[54px] w-full text-lg font-bold"
              >
                Go to the dashboard
              </router-link>
            </template>
            <template v-else>
              <h2
                class="text-lo-petrol m-0 text-[28px] leading-tight font-extrabold tracking-[-0.025em]"
              >
                Sign in to Law&amp;Orga
              </h2>
              <p class="text-lo-muted mt-2.5 mb-0 text-base">
                For members of organizations that use Law&amp;Orga.
              </p>
              <a
                :href="loginUrl"
                class="lo-btn lo-btn-primary mt-7 flex min-h-[54px] w-full text-lg font-bold"
              >
                Sign in
              </a>
              <div
                class="mt-3.5 flex flex-wrap justify-between gap-3 text-base"
              >
                <a :href="passwordResetUrl" class="text-lo-petrol">
                  Forgot your password?
                </a>
                <span class="text-lo-muted">2FA supported</span>
              </div>
              <div
                class="mt-8 border-t border-[#E6EBEC] pt-6 text-base leading-normal"
              >
                <p class="m-0 font-bold">Joining your organization?</p>
                <p class="text-lo-muted mt-1 mb-0">
                  If your organization already uses Law&amp;Orga,
                  <a :href="registerUrl" class="text-lo-petrol font-bold">
                    create your account</a
                  >. An admin of your organization accepts you.
                </p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
