<script setup lang="ts">
import { useMembers } from "../api/useMembers";
import { ChevronRightIcon } from "@heroicons/vue/20/solid";

const { members } = useMembers();
</script>

<template>
  <div v-if="members?.length">
    <h2 class="mt-8 text-lg font-medium leading-6 text-gray-700">
      New Members in no groups
    </h2>
    <ul class="p-1 mt-2 space-y-1 bg-white rounded shadow">
      <li v-for="member in members" :key="member.id" class="block">
        <router-link
          :to="{
            name: 'admin-profile',
            params: { id: member.rlcuserid },
          }"
          class="relative block w-full px-4 py-2 text-left text-gray-700 transition rounded-sm group hover:text-gray-900 hover:bg-gray-100"
        >
          {{ member.name }}
          <div
            class="absolute top-0 bottom-0 right-0 flex items-center justify-center transition opacity-0 group-hover:opacity-100"
          >
            <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
