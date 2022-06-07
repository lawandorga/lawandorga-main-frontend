<template>
  <PieChart :chart-data="chartData" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { PieChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import getColors from "@/utils/getColors";
import StatisticService from "@/services/statistic";
import { RecordClientValueCount } from "@/types/statistic";

Chart.register(...registerables);

export default defineComponent({
  components: { PieChart },
  setup() {
    const data = ref<RecordClientValueCount[]>([]);

    StatisticService.getRecordClientSex().then((d) => (data.value = d));

    const chartData = computed(() => ({
      labels: data.value.map((i) => i.value),
      datasets: [
        {
          label: "Amount",
          data: data.value.map((i) => i.count),
          backgroundColor: getColors(data.value.length),
        },
      ],
    }));

    return { chartData };
  },
});
</script>
