<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto">
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
          >
            <div
              class="
                shadow
                overflow-hidden
                border-b border-gray-200
                sm:rounded-lg
              "
            >
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Tag
                    </th>
                    <th
                      scope="col"
                      class="
                        relative
                        px-6
                        py-3
                        whitespace-nowrap
                        text-sm text-right
                      "
                    >
                      <button
                        type="button"
                        class="
                          text-gray-600
                          hover:text-gray-900
                          font-medium
                          bg-transparent
                        "
                        @click="openCreate()"
                      >
                        Add Tag
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in tags"
                    :key="item.name"
                    class="odd:bg-white even:bg-gray-50"
                  >
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      {{ item.name }}
                    </td>
                    <td
                      class="
                        px-6
                        py-4
                        whitespace-nowrap
                        text-sm
                        flex flex-row
                        space-x-2
                        justify-end
                      "
                    >
                      <button
                        type="button"
                        class="
                          text-gray-600
                          hover:text-gray-900
                          font-medium
                          bg-transparent
                        "
                        @click="openUpdate(item)"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="
                          text-gray-600
                          hover:text-gray-900
                          font-medium
                          bg-transparent
                        "
                        @click="openDelete(item)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  <tr class="odd:bg-white even:bg-gray-50">
                    <td colspan="2" class="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        type="button"
                        class="
                          text-gray-600
                          hover:text-gray-900
                          font-medium
                          bg-transparent
                        "
                        @click="openCreate()"
                      >
                        Add Tag
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
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
import { defineComponent } from "@vue/runtime-core";
import AdminService from "@/services/admin";
import { Tag } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";

export default defineComponent({
  components: {
    ModalDelete,
    ModalFree,
    FormGenerator,
    BoxLoader,
  },
  data: function () {
    return {
      // data
      tag: null as Tag | null,
      tags: [] as Tag[],
      // functions
      createTag: AdminService.createTag,
      updateTag: AdminService.updateTag,
      deleteTag: AdminService.deleteTag,
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
    AdminService.getTags().then((tags) => (this.tags = tags));
  },
  methods: {
    // create
    openCreate() {
      this.createOpen = true;
    },
    tagCreated(tag: Tag) {
      this.createOpen = false;
      this.tags.push(tag);
    },
    // update
    openUpdate(tag: Tag) {
      this.updateOpen = true;
      this.tag = tag;
    },
    tagUpdated(tag: Tag) {
      this.updateOpen = false;
      let index = this.tags.findIndex((item) => item.id === tag.id);
      if (index) this.tags.splice(index, 1, tag);
    },
    // delete
    openDelete(tag: Tag) {
      this.deleteOpen = true;
      this.tag = tag;
    },
    tagDeleted(tag: Tag) {
      this.deleteOpen = false;
      this.tags = this.tags.filter((item) => item.id !== tag.id);
    },
  },
});
</script>
