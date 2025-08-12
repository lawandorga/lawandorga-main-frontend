<script setup lang="ts">
import { getRegisterUrl } from "@/utils/login";
</script>

<template>
  <div class="bg-formcolor print:hidden">
    <div
      class="flex items-center justify-between shrink-0 h-16 px-4 border-b border-black/20"
    >
      <div class="flex space-x-3">
        <router-link
          :to="{ name: 'index' }"
          class="flex items-center space-x-2"
        >
          <img src="/logo.png" alt="Law&Orga" class="w-auto h-8" />
          <h1 class="text-2xl font-bold text-white">Law&Orga</h1>
        </router-link>
        <div class="w-px h-8 bg-white"></div>
        <img
          src="/sponsor-cms.jpg"
          alt="CMS Stiftung"
          class="w-auto h-8 overflow-hidden rounded"
        />
      </div>
      <div class="hidden pr-8 space-x-8 sm:block">
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
