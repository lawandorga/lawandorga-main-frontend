<script setup lang="ts">
import { getRegisterUrl } from "@/utils/login";
</script>

<template>
  <div class="bg-formcolor print:hidden">
    <div
      class="flex h-16 shrink-0 items-center justify-between border-b border-white/20 px-4"
    >
      <div class="flex space-x-3">
        <router-link
          :to="{ name: 'index' }"
          class="flex items-center space-x-2"
        >
          <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
          <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
        </router-link>
        <div class="h-8 w-px bg-white"></div>
        <img
          src="/sponsor-cms.jpg"
          alt="CMS Stiftung"
          class="h-8 w-auto overflow-hidden rounded"
        />
      </div>
      <div class="hidden space-x-8 pr-8 sm:block">
        <router-link
          class="text-lg font-medium text-white hover:underline"
          :to="{ name: 'records-upload' }"
        >
          Records Upload
        </router-link>
        <a
          class="text-lg font-medium text-white hover:underline"
          :href="getRegisterUrl()"
        >
          Register
        </a>
      </div>
    </div>
  </div>
</template>
