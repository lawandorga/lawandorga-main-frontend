<template>
  <BoxLoader :show="!!groupActions && !!groupActions.group">
    <div
      v-if="!!groupActions && !!groupActions.group"
      class="max-w-screen-lg mx-auto space-y-6"
    >
      <BreadcrumbsBar
        v-if="groupActions.group"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Groups',
            to: { name: 'admin-groups' },
          },
          {
            name: groupActions.group.name,
            to: { name: 'admin-group', params: { id: groupActions.group.id } },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="px-5 py-4 bg-white rounded shadow">
        <h2 class="mb-4 text-lg font-bold">
          {{ groupActions.group.name }}
        </h2>
        <div>
          <p>{{ groupActions.group.description }}</p>
        </div>
      </div>

      <TableGenerator
        :head="[
          { name: 'Permission', key: (obj) => obj.permission_object.name },
          { name: '', key: 'action' },
        ]"
        :data="groupActions.permissions"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="groupActions.addPermissionModalOpen = true"
            >
              Add Permission
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                groupActions.removePermissionModalOpen = true;
                groupActions.permissionTemporary = slotProps;
              "
            >
              Remove
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>

      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: 'E-Mail', key: 'email' },
          { name: '', key: 'action' },
        ]"
        :data="groupActions.members"
      >
        <template #name="slotProps">
          <ButtonNormal
            kind="link"
            :to="{ name: 'admin-profile', params: { id: slotProps.id } }"
          >
            {{ slotProps.name }}
          </ButtonNormal>
        </template>
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="groupActions.addMemberModalOpen = true"
            >
              Add Member
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                groupActions.removeMemberModalOpen = true;
                groupActions.memberTemporary = slotProps;
              "
            >
              Remove
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
  </BoxLoader>
  <ActionsGroup :id="($route.params.id as string)" ref="groupActions" />
</template>

<script lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import { TableGenerator, ButtonNormal } from "@lawandorga/components";
import { defineComponent, ref } from "vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ActionsGroup from "@/components/ActionsGroup.vue";

export default defineComponent({
  components: {
    BreadcrumbsBar,
    BoxLoader,
    TableGenerator,
    ButtonNormal,
    CogIcon,
    ActionsGroup,
  },
  setup() {
    const groupActions = ref<typeof ActionsGroup>();

    return {
      groupActions,
    };
  },
});
</script>
