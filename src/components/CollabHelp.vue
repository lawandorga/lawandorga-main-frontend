<template>
  <ButtonBreadcrumbs @click="helpModalOpen = true">Show Help</ButtonBreadcrumbs>
  <ModalFree v-model="helpModalOpen" width="max-w-xl" title="Help">
    <article class="prose">
      <p>Here is a short explanation of the different document permissions.</p>
      <p>
        Once you click on a Document you can see its permissions in the
        permission table. Those permissions always relate to the document that
        is opened or was clicked at.
      </p>
      <p>There are 3 different kind of permissions.</p>
      <p>
        Let's start with the simple one first: 'read_document'. With this
        permission the specified group can access the content of the document
        and read it.
      </p>
      <p>
        The second one: 'write_document' allows the specified group to read the
        content of the document and update it.
      </p>
      <p>
        Both permissions 'read_document' and 'write_document' apply to all
        children of the source document. A group that has the 'write_document'
        permission for the top level document can write and add documents
        everywhere within the tree.
      </p>
      <p>
        The last permission 'see_document' says that the specified group can see
        the document name within the tree structure. But it can not see its
        content. This permission appears when the group has access to a document
        further down the tree.
      </p>
    </article>
  </ModalFree>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ModalFree } from "@lawandorga/components";
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
