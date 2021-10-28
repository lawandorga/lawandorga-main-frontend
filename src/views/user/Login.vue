<template>
  <main class="divide-y divide-gray-100">
    <section class="bg-lorgablue mx-auto max-w-7xl py-8 px-8">
      <div class="max-w-7xl">
        <div class="grid grid-cols-2 gap-6">
          <div class="">
            <div>
              <h1
                class="
                  m-0
                  text-4xl
                  tracking-tight
                  font-extrabold
                  text-white
                  sm:leading-none
                  lg:text-5xl
                  xl:text-6xl
                "
              >
                <div class="flex space-x-4 items-center">
                  <img src="/logo.svg" alt="Law&Orga Logo" class="w-16 h-16" />
                  <span class="md:block">Law&Orga</span>
                </div>
              </h1>
              <p class="mt-3 text-base text-gray-200 sm:mt-5 sm:text-xl">
                <b>Law&Orga</b>
                ist ein
                <b>kostenfreies Akten- und Organisationsverwaltungssystem</b>
                , welches speziell auf die Bedürfnisse einer (R)LC angepasst
                ist.
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
              <h2 class="text-2xl font-bold mb-8">Login</h2>
              <FormGenerator
                :fields="[
                  {
                    label: 'E-Mail',
                    type: 'email',
                    tag: 'input',
                    name: 'email',
                    autocomplete: 'email',
                    required: true,
                  },
                  {
                    label: 'Password',
                    type: 'password',
                    autocomplete: 'current-passwort',
                    tag: 'input',
                    name: 'password',
                    required: true,
                  },
                ]"
                action="user/login"
                submit="Login"
              />
              <div class="pt-6 text-right space-x-4">
                <a routerLink="/register/">Register</a>
                <a routerLink="/forgot-password/">Forgot Password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="bg-white mx-auto max-w-7xl py-12 px-8">
      <div
        class="
          relative
          max-w-lg
          mx-auto
          divide-y-2 divide-gray-200
          lg:max-w-7xl
        "
      >
        <article
          class="prose prose-lg"
          [innerHTML]="page.content"
          *ngIf="page"
        ></article>
      </div>
    </section>

    <section class="bg-white mx-auto max-w-7xl py-12 px-8">
      <div class="relative max-w-lg mx-auto lg:max-w-7xl">
        <div>
          <h2
            class="
              text-3xl
              tracking-tight
              font-extrabold
              text-gray-900
              sm:text-4xl
            "
          >
            More News
          </h2>
        </div>
        <div class="pt-10 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
          <div *ngFor="let article of articles">
            <p class="text-sm text-gray-500">
              <time>{{ article.date|date:'MMM d, yyyy' }}</time>
            </p>
            <a [routerLink]="'/articles/' + article.id" class="mt-2 block">
              <p class="text-xl font-semibold text-gray-900">
                {{ article.title }}
              </p>
              <p class="mt-3 text-base text-gray-500 line-clamp-3">
                {{ article.description }}
              </p>
            </a>
            <div class="mt-3">
              <a
                [routerLink]="'/articles/' + article.id"
                class="text-base font-semibold text-lorgablue"
              >
                Read full article
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-white mx-auto max-w-7xl py-12 px-8">
      <div class="relative max-w-lg mx-auto lg:max-w-7xl">
        <div>
          <h2
            class="
              text-3xl
              tracking-tight
              font-extrabold
              text-gray-900
              sm:text-4xl
            "
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
    <section class="bg-white mx-auto max-w-7xl py-12 px-8">
      <div class="text-right space-x-4">
        <a routerLink="/legal_notice/">Imprint</a>
        <a target="_blank" href="http://rlc-deutschland.de/datenschutz/">
          Privacy
        </a>
      </div>
    </section> -->
  </main>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import FormGenerator from "@/components/FormGenerator.vue";

export default defineComponent({
  components: { FormGenerator },
  data: function () {
    return {
      roadmapItems: [],
    };
  },
  computed: {
    authenticated(): boolean {
      return this.$store.getters["user/isAuthenticated"];
    },
  },
  watch: {
    authenticated: function (newValue) {
      if (newValue) {
        this.next();
      }
    },
  },
  beforeMount() {
    if (this.authenticated) this.next();
  },
  methods: {
    next() {
      const url = this.$route.query.next as string;
      if (url) this.$router.push(url);
      else this.$router.push({ name: "collab-dashboard" });
    },
  },
});
</script>
