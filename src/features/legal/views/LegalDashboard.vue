<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/20/solid";
import { ScaleIcon } from "@heroicons/vue/24/outline";
import { ButtonNormal } from "lorga-ui";

import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import useCmd from "@/composables/useCmd";
import { useUserStore } from "@/store/user";
import { formatDate } from "@/utils/date";

import {
  useLegalRequirements,
  LegalRequirement,
} from "../api/useLegalRequirements";

const userStore = useUserStore();

const { legalRequirements, query } = useLegalRequirements();

const { commandRequest } = useCmd(query, () => userStore.updateData());

const accept = (lr: LegalRequirement) => {
  commandRequest({
    action: "legal/accept_legal_requirement",
    legal_requirement_id: lr.id,
  });
};
</script>

<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="space-y-6">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <ScaleIcon class="h-6 w-6" />
      </BreadcrumbsBar>

      <div class="mt-10 space-y-10">
        <div v-for="lr in legalRequirements" :key="lr.title">
          <div class="rounded border border-gray-200 bg-white shadow">
            <div class="px-6 pt-5">
              <Disclosure
                v-slot="{ open }"
                :default-open="!lr.accepted_of_user"
              >
                <DisclosureButton
                  class="flex w-full items-center justify-between"
                >
                  <div class="prose-sm prose max-w-none">
                    <h1 class="">
                      {{ lr.title }}
                    </h1>
                  </div>
                  <ChevronUpIcon
                    :class="open ? 'rotate-180 transform' : ''"
                    class="h-5 w-5 text-gray-700"
                  />
                </DisclosureButton>
                <DisclosurePanel class="prose-sm prose max-w-none">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-html="lr.content"></div>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div
              v-if="lr.events_of_user.length || !lr.accepted_of_user"
              class="mt-5"
            >
              <div class="border-t border-gray-200"></div>
              <div class="divide-y divide-gray-200">
                <div v-for="event in lr.events_of_user" :key="event.created">
                  <div class="px-6 py-2">
                    <p>
                      <span>{{ formatDate(event.created) }} -{{ " " }}</span>
                      <span v-if="event.actor">
                        {{ event.actor }} -{{ " " }}
                      </span>
                      <span v-if="event.accepted">
                        {{ lr.accept_text }}
                      </span>
                      <span v-if="event.text">{{ event.text }}</span>
                    </p>
                  </div>
                </div>
                <div v-if="!lr.accepted_of_user">
                  <div class="flex items-center justify-between px-6 py-2">
                    <p class="text-lg font-bold text-gray-800">
                      Action required:
                    </p>
                    <ButtonNormal @click="accept(lr)">
                      {{ lr.button_text }}
                    </ButtonNormal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BoxLoader>
</template>
