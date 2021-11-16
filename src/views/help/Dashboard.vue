<template>
  <div class="max-w-5xl mx-auto">
    <h2 class="text-lg font-medium mb-4">Help</h2>
    <div
      class="
        rounded-lg
        bg-gray-200
        shadow
        divide-y divide-gray-200
        sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px
      "
    >
      <div
        v-for="(item, index) in items"
        :key="item.title"
        class="
          relative
          group
          bg-white
          p-6
          focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500
        "
        :class="{ 'rounded-l-lg': index === 0, 'rounded-r-lg': index === 1 }"
      >
        <div>
          <span
            class="
              rounded-lg
              inline-flex
              p-3
              bg-gray-50
              text-gray-700
              ring-4 ring-white
            "
          >
            <component :is="item.icon" class="h-6 w-6 text-gray-600" />
          </span>
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
          class="
            pointer-events-none
            absolute
            top-6
            right-6
            text-gray-300
            group-hover:text-gray-400
          "
          aria-hidden="true"
        >
          <svg
            class="h-6 w-6"
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
    </div>
  </div>
</template>

<script lang="ts">
import { AnnotationIcon, ShieldCheckIcon } from "@heroicons/vue/outline";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const items = [
      {
        title: "Permissions",
        description:
          "Take a look at every permission and see what it is used for.",
        link: { name: "help-permissions" },
        icon: ShieldCheckIcon,
      },
      {
        title: "Bug Report",
        description: "Coming in the future..",
        link: { name: "help-dashboard" },
        icon: AnnotationIcon,
      },
    ];

    return {
      items,
    };
  },
});
</script>
