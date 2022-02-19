<template>
  <Table>
    <Thead>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item.key">
          <div v-if="item.key === 'action'" class="flex justify-end space-x-3">
            <slot :name="`head-${item.key}`" />
          </div>
          <slot v-else :name="`head-${item.key}`">
            {{ item.name }}
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
          <div
            v-if="headItem.key === 'action'"
            class="flex justify-end space-x-3"
          >
            <slot v-bind="dataItem" name="action" />
          </div>
          <slot v-else v-bind="dataItem" :name="headItem.key">
            {{ getData(dataItem, headItem.key) }}
          </slot>
        </Td>
      </Tr>
      <Tr v-show="innerLoading">
        <Td :colspan="head.length">
          <CircleLoader />
        </Td>
      </Tr>
      <Tr>
        <Td class="text-right !py-2.5" :colspan="head.length">
          <span v-if="!innerLoading && data">{{ data.length }} Total</span>
          <span v-else>Loading...</span>
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
  [key: string]: string | NestedObject;
}

type KeyFunction = (_: JsonModel) => string | number | boolean;  // eslint-disable-line

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
      type: Array as PropType<
        { key: NestedObject | KeyFunction; name: string }[]
      >,
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
      key: string | string[] | KeyFunction,
    ): string | number | boolean {
      if (typeof key === "function") {
        return key(data);
      } else if (Array.isArray(key)) {
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
