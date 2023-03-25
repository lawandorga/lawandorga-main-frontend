<template>
  <BoxLoader :show="true">
    <div class="grid max-w-screen-sm gap-6 mx-auto">
      <BreadcrumbsBar
        :base="{ name: 'records-dashboard' }"
        :pages="[
          {
            name: 'Pool',
            to: { name: 'records-pool' },
          },
        ]"
      >
        <RectangleStackIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div style="max-width: 500px">
        <h2 class="text-lg font-bold">Pool Status</h2>
        <div>
          <div v-if="pool">
            Enlisted Records:
            {{ pool.type === "records" ? pool.entries.length : "-" }}
            <br />
            Enlisted Consultants:
            {{ pool.type === "consultants" ? pool.entries.length : "-" }}
            <br />
            <br />
            <ButtonNormal type="button" @click="enlist()">
              {{ pool.type === "records" ? "Take record" : "Enlist" }}
            </ButtonNormal>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-bold">Yield Record</h2>
        <div>
          <FormGenerator
            :fields="fields"
            :request="yieldRecord"
          ></FormGenerator>
        </div>
      </div>
      <div>
        {{ success }}
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { FormGenerator, ButtonNormal } from "@lawandorga/components";
import RecordsService from "@/services/records";
import { Pool } from "@/types/records";
import { JsonModel } from "@/types/shared";

export default defineComponent({
  components: {
    BoxLoader,
    ButtonNormal,
    BreadcrumbsBar,
    RectangleStackIcon,
    FormGenerator,
  },
  setup() {
    const fields = ref([
      {
        label: "Record",
        type: "select",
        name: "record",
        required: true,
        options: [] as { id: number; name: string | number }[],
      },
    ]);
    const pool = ref<Pool | null>(null);
    const success = ref("");

    onMounted(() => getPool());
    onMounted(() =>
      RecordsService.getRecords().then(
        (items) =>
          (fields.value[0].options = items.map((item) => ({
            id: item.id,
            name: item.entries["Token"]
              ? (item.entries["Token"].value as string)
              : item.id,
          }))),
      ),
    );

    const getPool = () =>
      RecordsService.getPool().then((item) => (pool.value = item));

    const enlist = () => {
      success.value = "";
      return RecordsService.enlist()
        .then((message) => (success.value = message))
        .finally(() => getPool());
    };

    const yieldRecord = (data: JsonModel) => {
      success.value = "";
      return RecordsService.yieldRecord(data)
        .then(() => (success.value = "Record was added to the record pool."))
        .finally(() => getPool());
    };

    return {
      fields,
      pool,
      success,
      enlist,
      yieldRecord,
    };
  },
});
</script>
