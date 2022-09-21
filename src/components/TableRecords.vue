<template>
  <div class="right-0 max-w-md md:ml-auto md:sticky">
    <FormInput
      v-model="search"
      label=""
      placeholder="AZ-123 / Open / Consultant / Tag"
      type="search"
      required
    />
  </div>
  <TableSortable
    :head="head"
    :data="filteredRecords"
    :get-value-func="getValueFunc"
    :sort-key="userStore.getSetting('recordsSortKey')"
    :sort-order="userStore.getSetting('recordsSortOrder')"
    @update:sort-key="userStore.updateSetting('recordsSortKey', $event)"
    @update:sort-order="userStore.updateSetting('recordsSortOrder', $event)"
  >
    <template #head-action>
      <slot name="head-action"></slot>
    </template>
    <template
      v-for="(headItem, index) in head"
      #[headItem.key]="{ item }"
      :key="headItem.key"
    >
      <div>
        <template v-if="index === 0">
          <ButtonLink
            v-if="item.access"
            :to="{
              name: 'records-detail',
              params: { id: item.id },
            }"
          >
            {{ getValueFunc(item, headItem.key, "NO-IDENTIFIER") }}
          </ButtonLink>
          <div v-else>
            {{ getValueFunc(item, headItem.key, "NO-IDENTIFIER") }}
          </div>
        </template>

        <template v-else-if="item.entries[headItem.key]">
          <ul
            v-if="item.entries[headItem.key].type === 'multiple'"
            class="list-disc pl-3.5"
          >
            <li v-for="i in item.entries[headItem.key].value" :key="i">
              <button
                class="text-left cursor-pointer hover:underline"
                @click="search = i"
              >
                {{ i }}
              </button>
            </li>
          </ul>

          <button
            v-else
            class="max-w-xs text-left whitespace-normal cursor-pointer line-clamp-3 hover:underline"
            @click="search = getValueFunc(item, headItem.key)"
          >
            {{ getValueFunc(item, headItem.key) }}
          </button>
        </template>

        <template v-else-if="headItem.key === 'action'">
          <slot :record="item" name="action"></slot>
        </template>

        <template v-else>-</template>
      </div>
    </template>
  </TableSortable>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, computed } from "vue";
import { FormInput, TableSortable, types } from "@lawandorga/components";
import { Record } from "@/types/records";
import { formatDate } from "@/utils/date";
import ButtonLink from "@/components/ButtonLink.vue";
import useSearch from "@/composables/useSearch";
import { useUserStore } from "@/store/user";

export default defineComponent({
  components: {
    TableSortable,
    FormInput,
    ButtonLink,
  },
  props: {
    records: {
      type: Array as PropType<Record[] | null>,
      required: false,
      default: null,
    },
  },
  emits: ["search"],
  setup(props) {
    // records
    const { records } = toRefs(props);

    // helpers
    const getValueFromEntry = (
      entry: types.JsonModel,
      defaultValue = "",
    ): string => {
      if (entry.type === "date" || entry.type === "datetime-local")
        return formatDate(entry.value);
      else if (entry.type === "text" || entry.type === "select")
        return entry.value;
      else if (entry.type === "multiple" && Array.isArray(entry.value))
        return entry.value.join(", ");
      return defaultValue;
    };

    const getValueFromRecord = (
      r: types.JsonModel,
      key: string,
      defaultValue = "",
    ): string => {
      const entry = r.entries[key];

      if (entry !== undefined) return getValueFromEntry(entry, defaultValue);
      return defaultValue;
    };

    // loading
    const innerLoading = computed(() => {
      return records.value === null;
    });

    // head
    const head = computed(() => {
      if (records.value === null) return [];
      const head1 = Array.from(
        new Set(records.value.map((r: Record) => r.show).flat()),
      );
      const head2 = head1.map((n) => ({ name: n, key: n, sortable: true }));
      head2.push({ name: "", key: "action", sortable: false });
      return head2;
    });

    // filter
    const filterKeys = computed(() => head.value.map((h) => h.name));
    const { filteredItems: filteredRecords, search } = useSearch(
      records,
      filterKeys,
      getValueFromRecord,
    );

    // set default sort
    const userStore = useUserStore();

    // ts error
    const getKey = (h): string => h.key;

    // return
    return {
      getKey,
      search,
      formatDate,
      filteredRecords,
      getValueFunc: getValueFromRecord,
      innerLoading,
      head,
      userStore,
    };
  },
});
</script>
