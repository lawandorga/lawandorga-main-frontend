<template>
  <Table>
    <Thead>
      <Tr class="divide-x divide-gray-200">
        <Th v-for="item in head" :key="item.key">
          <div class="flex items-center justify-between">
            {{ item.name }}
          </div>
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
import { defineComponent } from "@vue/runtime-core";

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
  },
  props: {
    head: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
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
