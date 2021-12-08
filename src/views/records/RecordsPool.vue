<template>
  <BoxLoader :show="true">
    <div class="grid gap-6 max-w-screen-sm mx-auto">
      <BreadcrumbsBar
        :base="{ name: 'records-dashboard' }"
        :pages="[
          {
            name: 'Pool',
            to: { name: 'records-pool' },
          },
        ]"
      >
        <CollectionIcon class="w-6 h-6" />
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
            <ButtonBlue type="button" @click="enlist()">
              {{ pool.type === "records" ? "Take record" : "Enlist" }}
            </ButtonBlue>
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
import { CollectionIcon } from "@heroicons/vue/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import RecordsService from "@/services/records";
import { Pool, RestrictedRecord } from "@/types/records";
import { JsonModel } from "@/types/shared";
import ButtonBlue from "@/components/ButtonNormal.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    BoxLoader,
    ButtonBlue,
    BreadcrumbsBar,
    CollectionIcon,
    FormGenerator,
  },
  setup() {
    const store = useStore();

    const fields = ref([
      {
        label: "Record",
        type: "select",
        name: "record",
        required: true,
        options: [] as RestrictedRecord[],
      },
    ]);
    const pool = ref<Pool | null>(null);
    const success = ref("");

    onMounted(() => getPool());
    onMounted(() =>
      RecordsService.getRecords().then(
        (items) =>
          (fields.value[0].options = items
            .filter((record) => record.state !== "cl")
            .filter((record) =>
              record.working_on_record
                .map((user) => user.id)
                .includes(store.getters["user/user"].id),
            )
            .map((item) => ({
              ...item,
              name: item.record_token,
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
