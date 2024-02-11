<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'help-dashboard' }"
      :pages="[]"
    >
      <LifebuoyIcon class="w-6 h-6" />
    </BreadcrumbsBar>
    <div
      class="bg-gray-200 divide-y divide-gray-200 rounded-lg shadow sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px"
    >
      <div
        v-for="item in items"
        :key="item.title"
        class="relative p-6 bg-white group focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500"
        :class="[item.class]"
      >
        <div v-if="item.title">
          <span
            class="inline-flex p-3 text-gray-700 rounded-lg bg-gray-50 ring-4 ring-white"
          >
            <component :is="item.icon" class="w-6 h-6 text-gray-600" />
          </span>
        </div>
        <div v-if="item.title" class="mt-8">
          <h3 class="text-lg font-medium">
            <component
              :is="item.is"
              v-bind="item.attrs"
              class="focus:outline-none"
            >
              <!-- Extend touch target to entire panel -->
              <div class="absolute inset-0" aria-hidden="true"></div>
              {{ item.title }}
            </component>
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            {{ item.description }}
          </p>
        </div>
        <span
          v-if="item.title"
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
    </div>
  </div>
</template>

<script lang="ts">
import {
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  LifebuoyIcon,
} from "@heroicons/vue/24/outline";
import { defineComponent, ref, computed } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useGet from "@/composables/useGet";
import useClient from "@/api/client";

interface HelpPage {
  id: number;
  manual_url: string | null;
}

export default defineComponent({
  components: {
    BreadcrumbsBar,
    LifebuoyIcon,
    DocumentTextIcon,
  },
  setup() {
    const page = ref<HelpPage | null>(null);

    const client = useClient();
    const request = client.get("api/internal/pages/help/");
    useGet(request, page);

    const items = computed(() => [
      {
        title: "Permissions",
        description:
          "Take a look at every permission and see what it is used for.",
        attrs: { to: { name: "help-permissions" } },
        icon: ShieldCheckIcon,
        class: "rounded-t-lg sm:rounded-tr-none",
        is: "router-link",
      },
      {
        title: "Bug Report",
        description:
          "You've discovered something that doesn't work? Please send an email to it@law-orga.de. We're happy to help.",
        attrs: { href: "mailto:it@law-orga.de?subject=Bug%20Report" },
        icon: ChatBubbleBottomCenterTextIcon,
        class: "sm:rounded-tr-lg",
        is: "a",
      },
      {
        title: "User Guide",
        description: "The user guide that explains how to use Law&Orga.",
        attrs: {
          href:
            page.value && page.value.manual_url ? page.value.manual_url : "#",
          target: "_blank",
        },
        icon: DocumentTextIcon,
        class: "sm:rounded-bl-lg",
        is: "a",
      },
      {
        title: "Ask for help",
        icon: LifebuoyIcon,
        description:
          "You need help with how to setup Law&Orga or you have a question about how Law&Orga works? Just send an email to user_management@law-orga.de. We're happy to help.",
        attrs: {
          href: "mailto:user_management@law-orga.de?subject=Help%20Request",
        },
        class: "rounded-b-lg sm:rounded-bl-none",
        is: "a",
      },
    ]);

    return {
      items,
    };
  },
});
</script>
