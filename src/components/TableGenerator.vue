<template>
  <Table>
    <Thead>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item.key">
          <slot :name="`head-${item.key}`">
            <div class="flex items-center justify-between">
              {{ item.name }}
            </div>
          </slot>
        </Th>
      </Tr>
    </Thead>
    <Tbody>
      <Tr
        v-for="(dataItem, index) in data"
        :key="index"
        class="divide-x divide-gray-100"
      >
        <Td v-for="headItem in head" :key="headItem.key">
          <slot :dataItem="dataItem" :headItem="headItem" :name="headItem.key">
            {{ getData(dataItem, headItem.key) }}
          </slot>
        </Td>
      </Tr>
      <Tr v-if="!innerLoading && data">
        <Td class="text-right !py-2.5" :colspan="head.length">
          {{ data.length }} Total
        </Td>
      </Tr>
      <Tr v-show="innerLoading">
        <Td :colspan="head.length">
          <CircleLoader />
        </Td>
      </Tr>
    </Tbody>
  </Table>
</template>

<script lang="ts">
import Table from "./TableTable.vue";
import Td from "./TableData.vue";
import Tbody from "./TableBody.vue";
import Thead from "./TableHeader.vue";
import Tr from "./TableRow.vue";
import Th from "./TableHead.vue";
import { defineComponent, PropType } from "vue";
import { JsonModel } from "@/types/shared";
import CircleLoader from "./CircleLoader.vue";

interface NestedObject {
  [key: string]: string | number | boolean | NestedObject;
}

export default defineComponent({
  components: {
    Th,
    Td,
    Tbody,
    Thead,
    Tr,
    Table,
    CircleLoader,
  },
  props: {
    head: {
      type: Array as PropType<{ key: string; name: string }[]>,
      required: true,
    },
    data: {
      type: Array as PropType<JsonModel[] | null>,
      required: false,
      default: null,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    innerLoading() {
      return this.loading || this.data === null;
    },
  },
  methods: {
    getData(
      data: NestedObject,
      key: string | string[],
    ): string | number | boolean {
      if (Array.isArray(key)) {
        let newData = data as NestedObject | string | number | boolean;
        key.forEach((key) => {
          if (newData) newData = (newData as NestedObject)[key];
          else return "";
        });
        return newData as unknown as string | number | boolean;
      }
      return data[key] as number | string | boolean;
    },
  },
});
</script>
