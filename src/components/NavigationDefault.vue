<template>
  <div class="bg-lorgablue">
    <div
      class="
        flex
        items-center
        flex-shrink-0
        px-4
        h-16
        border-b border-white border-opacity-20
      "
    >
      <router-link :to="{ name: 'index' }" class="flex space-x-2 items-center">
        <img src="/rlc_intranet_logo.png" alt="Law&Orga" class="h-8 w-auto" />
        <h1 class="text-white font-bold text-2xl">Law&Orga</h1>
      </router-link>
    </div>
  </div>
</template>
