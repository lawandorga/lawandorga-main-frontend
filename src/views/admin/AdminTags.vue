<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Tags', to: { name: 'admin-tags' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :data="tags"
        :head="[
          { name: 'Tag', key: 'name' },
          { name: '', key: 'action' },
        ]"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal size="xs" kind="action" @click="openCreate()">
              Add Tag
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="openUpdate(slotProps.dataItem)"
            >
              Edit
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="openDelete(slotProps.dataItem)"
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <ModalFree v-model="createOpen" title="Create Tag">
      <FormGenerator
        :fields="fields"
        :request="createTag"
        @success="tagCreated($event)"
      />
    </ModalFree>
    <ModalFree v-model="updateOpen" title="Update Tag">
      <FormGenerator
        :fields="fields"
        :initial="tag"
        :request="updateTag"
        @success="tagUpdated($event)"
      />
    </ModalFree>
    <ModalDelete
      v-model="deleteOpen"
      :request="deleteTag"
      :object="tag"
      @deleted="tagDeleted($event)"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import RecordsService from "@/services/records";
import { Tag } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";

export default defineComponent({
  components: {
    ButtonNormal,
    CogIcon,
    TableGenerator,
    BreadcrumbsBar,
    ModalDelete,
    ModalFree,
    FormGenerator,
    BoxLoader,
  },
  data: function () {
    return {
      // data
      tag: null as Tag | null,
      tags: null as Tag[] | null,
      // functions
      createTag: RecordsService.createTag,
      updateTag: RecordsService.updateTag,
      deleteTag: RecordsService.deleteTag,
      // modals
      createOpen: false,
      updateOpen: false,
      deleteOpen: false,
      // fields
      fields: [
        {
          label: "Name",
          name: "name",
          type: "text",
          required: true,
        },
      ],
    };
  },
  mounted() {
    RecordsService.getTags().then((tags) => (this.tags = tags));
  },
  methods: {
    // create
    openCreate() {
      this.createOpen = true;
    },
    tagCreated(tag: Tag) {
      this.createOpen = false;
      if (Array.isArray(this.tags)) this.tags.push(tag);
    },
    // update
    openUpdate(tag: Tag) {
      this.updateOpen = true;
      this.tag = tag;
    },
    tagUpdated(tag: Tag) {
      this.updateOpen = false;
      if (Array.isArray(this.tags)) {
        let index = this.tags.findIndex((item) => item.id === tag.id);
        if (index) this.tags.splice(index, 1, tag);
      }
    },
    // delete
    openDelete(tag: Tag) {
      this.deleteOpen = true;
      this.tag = tag;
    },
    tagDeleted(tag: Tag) {
      this.deleteOpen = false;
      if (Array.isArray(this.tags))
        this.tags = this.tags.filter((item) => item.id !== tag.id);
    },
  },
});
</script>
