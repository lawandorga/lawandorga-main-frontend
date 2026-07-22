<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { BellIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";

import { formatDate } from "@/utils/date";

import {
  useNotifications,
  type CalendarNotification,
} from "../composables/useNotifications";

const router = useRouter();
const { notifications, unreadCount, markRead, markAllRead } =
  useNotifications();

const openNotification = (
  notification: CalendarNotification,
  close: () => void,
) => {
  if (notification.read_at === null) markRead(notification.uuid);
  close();
  router.push({
    name: "calendar-dashboard",
    query: { event: notification.event_uuid },
  });
};
</script>

<template>
  <Popover class="relative">
    <PopoverButton
      class="relative flex cursor-pointer items-center rounded-full p-1 text-gray-200 hover:text-white focus:ring-2 focus:ring-gray-200 focus:outline-none"
    >
      <span class="sr-only">Notifications</span>
      <BellIcon class="h-6 w-6" aria-hidden="true" />
      <span v-if="unreadCount > 0" class="absolute -top-0.5 -right-0.5 flex">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
        />
        <span
          class="relative flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
        >
          {{ unreadCount }}
        </span>
      </span>
    </PopoverButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <PopoverPanel
        v-slot="{ close }"
        class="absolute right-0 z-20 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
      >
        <div
          class="flex items-center justify-between border-b border-gray-100 px-4 py-2"
        >
          <span class="text-sm font-medium text-gray-900">Notifications</span>
          <button
            v-if="unreadCount > 0"
            type="button"
            class="cursor-pointer text-xs text-blue-600 hover:text-blue-800"
            @click="markAllRead"
          >
            Mark all read
          </button>
        </div>

        <ul
          v-if="notifications && notifications.length"
          class="max-h-96 divide-y divide-gray-100 overflow-y-auto"
        >
          <li v-for="notification in notifications" :key="notification.uuid">
            <button
              type="button"
              class="flex w-full cursor-pointer items-start gap-2 px-4 py-3 text-left hover:bg-gray-50"
              @click="openNotification(notification, close)"
            >
              <span
                class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                :class="
                  notification.read_at === null
                    ? 'bg-blue-500'
                    : 'bg-transparent'
                "
              />
              <span class="min-w-0">
                <span class="block text-sm text-gray-800">
                  {{ notification.message }}
                </span>
                <span class="block text-xs text-gray-400">
                  {{ formatDate(notification.created) }}
                </span>
              </span>
            </button>
          </li>
        </ul>
        <p v-else class="px-4 py-6 text-center text-sm text-gray-500">
          No notifications.
        </p>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
