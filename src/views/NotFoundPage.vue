<template>
  <div
    class="px-4 py-16 bg-white lg:min-h-full sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8"
  >
    <div class="mx-auto max-w-max">
      <main class="sm:flex">
        <p class="text-4xl font-extrabold text-formcolor sm:text-5xl">404</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 sm:pl-6">
            <h1
              class="text-4xl font-extrabold tracking-tight text-formcolor sm:text-5xl"
            >
              Page not found
            </h1>
            <p class="mt-1 text-base text-gray-500">
              Please check the URL in the address bar and try again.
            </p>
          </div>
          <div
            class="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6"
          >
            <ButtonNormal kind="primary" to="/">Go back home</ButtonNormal>
            <ButtonNormal href="mailto:it@law-orga.de" kind="secondary">
              Contact support
            </ButtonNormal>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ButtonNormal } from "lorga-ui";
</script>
