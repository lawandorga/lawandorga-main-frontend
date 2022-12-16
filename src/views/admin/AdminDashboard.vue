<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'admin-dashboard' }"
      :pages="[]"
    >
      <CogIcon class="w-6 h-6" />
    </BreadcrumbsBar>
    <div
      class="bg-gray-200 divide-y divide-gray-200 rounded-lg shadow sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px"
    >
      <template v-for="item in items" :key="item.title">
        <div
          v-if="item.placeholder"
          class="bg-gray-50"
          :class="[item.class]"
        ></div>
        <div
          v-else
          class="relative p-6 bg-white group focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500"
          :class="[item.class]"
        >
          <div class="relative">
            <span
              class="inline-flex p-3 text-gray-700 rounded-lg bg-gray-50 ring-4 ring-white"
            >
              <Component :is="item.icon" class="w-6 h-6 text-gray-600" />
            </span>
            <div
              v-if="item.notifications && item.notifications > 0"
              class="absolute top-0 left-0 flex items-center justify-center w-6 h-6 text-sm font-bold text-red-800 transform translate-x-8 -translate-y-1 bg-red-200 rounded-full"
            >
              {{ item.notifications }}
            </div>
          </div>
          <div class="mt-8">
            <h3 class="text-lg font-medium">
              <router-link :to="item.link" class="focus:outline-none">
                <!-- Extend touch target to entire panel -->
                <div class="absolute inset-0" aria-hidden="true"></div>
                {{ item.title }}
              </router-link>
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              {{ item.description }}
            </p>
          </div>
          <span
            class="absolute text-gray-300 pointer-events-none top-6 right-6 group-hover:text-gray-400"
            aria-hidden="true"
          >
            <svg
              class="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z"
              />
            </svg>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  LockOpenIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  TrashIcon,
  UsersIcon,
  UserIcon,
  CogIcon,
  WindowIcon,
} from "@heroicons/vue/24/outline";
import { type Component, computed } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useUserStore } from "@/store/user";
import { RouteLocationRaw } from "vue-router";

const store = useUserStore();

type AdminItem =
  | {
      title: string;
      description: string;
      link: RouteLocationRaw;
      icon?: Component;
      notifications?: number;
      class?: string;
      placeholder?: false;
    }
  | { placeholder: true; class?: string };

const items = computed<AdminItem[]>(() => [
  {
    title: "Profiles",
    description:
      "Here you can manage the users of your RLC. If you have the 'manage_users' permission you can change their contact information. If you have the 'manage_permissions' permission you can update the permissions of every user.",
    link: { name: "admin-profiles" },
    icon: UserIcon,
    notifications: store.badges?.profiles,
    class: "rounded-t-lg sm:rounded-tr-none",
  },
  {
    title: "Groups",
    description:
      "Here you can manage the groups of your RLC. If you have the 'manage_groups' permission you can add, change and remove groups. You can also add and remove users. If you have the 'manage_permissions' permission you can add permissions to a group or remove permissions from a group.",
    link: { name: "admin-groups" },
    icon: UsersIcon,
    notifications: 0,
    class: "sm:rounded-tr-lg",
  },
  {
    title: "Record Templates",
    description:
      "Add and edit your record templates. You can add, change and remove fields.",
    link: { name: "admin-templates" },
    icon: RectangleGroupIcon,
    notifications: 0,
    class: "",
  },
  {
    title: "Record-Access-Requests",
    description:
      "Here you can allow somebody access to a record. But first he or she must have requested access to that specific record.",
    link: { name: "admin-recordpermitrequests" },
    icon: LockOpenIcon,
    notifications: store.badges?.record_permit_requests,
    class: "",
  },
  {
    title: "Record-Deletion-Requests",
    description:
      "If somebody requested to delete a record you can take a look and allow that request here.",
    link: { name: "admin-recorddeletionrequests" },
    icon: TrashIcon,
    notifications: store.badges?.record_deletion_requests,
    class: "",
  },
  {
    title: "Record Questionnaires",
    description:
      "Here you can create questionnaire templates that can be send out from the record detail page.",
    link: { name: "admin-questionnaires" },
    icon: QuestionMarkCircleIcon,
    notifications: 0,
    class: "",
  },
  {
    title: "Sidebar",
    description: "Here you can change the sidebar and add external links.",
    link: { name: "admin-sidebar" },
    icon: WindowIcon,
    notifications: 0,
    class: "sm:rounded-bl-lg",
  },
  {
    placeholder: true,
    class: "rounded-b-lg sm:rounded-bl-none",
  },
]);
</script>
