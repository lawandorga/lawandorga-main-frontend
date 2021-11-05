<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
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
                      @click="createTag()"
                    >
                      Add Tag
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="tag in tags"
                  :key="tag.name"
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
                    {{ tag.name }}
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
                      @click="updateTag(tag)"
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
                      @click="deleteTag(tag.id)"
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
                      @click="createTag()"
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
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import AdminService from "@/services/admin";
import { Tag } from "@/types/records";

export default defineComponent({
  data: function () {
    return {
      tags: [] as Tag[],
    };
  },
  mounted() {
    AdminService.getTags().then((tags) => (this.tags = tags));
  },
});
</script>
