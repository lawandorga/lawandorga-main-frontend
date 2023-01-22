<template>
  <BoxLoader :show="userStore.loaded">
    <div v-if="userStore.loaded" class="max-w-3xl mx-auto space-y-6">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <ScaleIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <div class="mt-10 space-y-10">
        <div v-for="lr in legalRequirements" :key="lr.id">
          <div class="bg-white border rounded shadow">
            <div class="px-6 pt-5">
              <Disclosure v-slot="{ open }" :default-open="!lr.accepted">
                <DisclosureButton
                  class="flex items-center justify-between w-full"
                >
                  <div class="prose-sm prose max-w-none">
                    <h1 class="">
                      {{ lr.legal_requirement.title }}
                    </h1>
                  </div>
                  <ChevronUpIcon
                    :class="open ? 'rotate-180 transform' : ''"
                    class="w-5 h-5 text-gray-700"
                  />
                </DisclosureButton>
                <DisclosurePanel class="prose-sm prose max-w-none">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <div v-html="lr.legal_requirement.content"></div>
                </DisclosurePanel>
              </Disclosure>
            </div>
            <div v-if="lr.events_list.length || !lr.accepted" class="mt-5">
              <div class="border-t"></div>
              <div class="divide-y">
                <div v-for="event in lr.events_list" :key="event.created">
                  <div class="px-6 py-2">
                    <p>
                      <span>{{ formatDate(event.created) }} -{{ " " }}</span>
                      <span v-if="event.actor">
                        {{ event.actor.name }} -{{ " " }}
                      </span>
                      <span v-if="event.accepted">
                        {{ lr.legal_requirement.accept_text }}
                      </span>
                      <span v-if="event.text">{{ event.text }}</span>
                    </p>
                  </div>
                </div>
                <div v-if="!lr.accepted">
                  <div class="flex items-center justify-between px-6 py-2">
                    <p class="text-lg font-bold text-gray-800">
                      Action required:
                    </p>
                    <ButtonNormal @click="accept(lr)">
                      {{ lr.legal_requirement.button_text }}
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

<script setup lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { ScaleIcon } from "@heroicons/vue/24/outline";
import { useUserStore } from "@/store/user";
import { ref } from "vue";
import { ButtonNormal } from "@lawandorga/components";
import { formatDate } from "@/utils/date";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/20/solid";
import { LegalRequirement } from "@/types/legal";
import useCommand from "@/composables/useCommand";
import LegalService from "@/services/legal";
import useGet from "@/composables/useGet";
import useQuery from "@/composables/useQuery";

const userStore = useUserStore();

const legalRequirements = ref<LegalRequirement[] | null>(null);

useGet(LegalService.getLegalRequirements, legalRequirements);

const { commandRequest: accept } = useCommand(
  LegalService.acceptLegalRequirement,
  [
    useQuery(LegalService.getLegalRequirements, legalRequirements),
    () => userStore.updateData(),
  ],
);
</script>
