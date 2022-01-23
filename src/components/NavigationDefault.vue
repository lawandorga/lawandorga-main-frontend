<template>
  <div class="bg-lorgablue">
    <div
      class="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-white border-opacity-20"
    >
      <div class="flex space-x-3">
        <router-link
          :to="{ name: 'index' }"
          class="flex space-x-2 items-center"
        >
          <img src="/logo.png" alt="Law&Orga" class="h-8 w-auto" />
          <h1 class="text-white font-bold text-2xl">Law&Orga</h1>
        </router-link>
        <div class="w-px h-8 bg-white"></div>
        <img
          src="/sponsor-cms.jpg"
          alt="CMS Stiftung"
          class="h-8 w-auto rounded overflow-hidden"
        />
      </div>
      <div class="pr-8 space-x-8 hidden sm:block">
        <router-link
          class="text-white font-medium text-lg hover:underline"
          :to="{ name: 'records-upload' }"
        >
          Records Upload
        </router-link>
        <router-link
          class="text-white font-medium text-lg hover:underline"
          :to="{ name: 'user-register' }"
        >
          Register
        </router-link>
      </div>
    </div>
  </div>
</template>
