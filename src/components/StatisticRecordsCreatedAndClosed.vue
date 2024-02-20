<template>
  <BarChart :chart-data="chartData" />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import getColors from "@/utils/getColors";
import StatisticService from "@/features/statistics/statistic";
import { RecordsCreatedClosed } from "@/types/statistic";

Chart.register(...registerables);

export default defineComponent({
  components: { BarChart },
  setup() {
    const data = ref<RecordsCreatedClosed[]>([]);

    StatisticService.getRecordsCreatedAndClosed().then((d) => (data.value = d));

    const chartData = computed(() => ({
      labels: data.value.map((i) => i.month),
      datasets: [
        {
          label: "Created",
          data: data.value.map((i) => i.created),
          backgroundColor: getColors(1),
        },
        {
          label: "Closed",
          data: data.value.map((i) => i.closed),
          backgroundColor: getColors(2).slice(1),
        },
      ],
    }));

    return { chartData };
  },
});
</script>
@/features/statistics/statistic
