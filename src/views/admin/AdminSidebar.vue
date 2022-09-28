<template>
  <BoxLoader :show="true">
    <div v-if="actionsLinks" class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Sidebar', to: { name: 'admin-sidebar' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>

      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: 'Link', key: 'link' },
          { name: '', key: 'action' },
        ]"
        :data="actionsLinks?.links"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="actionsLinks.createModalOpen = true"
            >
              Create Link
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                actionsLinks.temporary = slotProps;
                actionsLinks.deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
  <ActionsLinks ref="actionsLinks" />
</template>

<script setup lang="ts">
import { TableGenerator, ButtonNormal } from "@lawandorga/components";
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ActionsLinks from "@/components/ActionsLinks.vue";
import { ref } from "vue";

const actionsLinks = ref<typeof ActionsLinks>();
</script>
