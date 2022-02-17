<template>
  <ButtonBreadcrumbs @click="helpModalOpen = true">Show Help</ButtonBreadcrumbs>
  <ModalFree v-model="helpModalOpen" width="max-w-xl" title="Help">
    <article class="prose">
      <p>Here is a short explanation of the different folder permissions.</p>
      <p>
        Once you click on a folder you can see its permissions in the permission
        table. Those permissions always relate to the folder that is open.
      </p>
      <p>There are 3 different kind of permissions.</p>
      <p>
        Let's start with the simple one first: 'read_folder'. With this
        permission the specified group can access the files of the folder and
        download them.
      </p>
      <p>
        The second one: 'write_folder' allows the specified group to upload and
        delete files within that folder.
      </p>
      <p>
        Both permissions 'read_folder' and 'write_folder' apply to all children
        of the source folder. A group that has the 'write_folder' permission for
        the top level folder can upload and delete files in every subfolder.
      </p>
      <p>
        The last permission 'see_folder' says that the specified group can see
        the folder name. But it can not see any files only the subfolder that
        leads to the source of the 'see_folder' permission.
      </p>
    </article>
  </ModalFree>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ModalFree from "@/components/ModalFree.vue";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";

export default defineComponent({
  components: {
    ButtonBreadcrumbs,
    ModalFree,
  },
  data() {
    return {
      helpModalOpen: false,
    };
  },
});
</script>
