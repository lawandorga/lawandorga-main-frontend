<script lang="ts">
import { Chart, registerables } from "chart.js";
import { defineComponent, ref, computed } from "vue";
import { PieChart } from "vue-chart-3";

import StatisticService from "@/features/statistics/statistic";
import { RecordState } from "@/features/statistics/types";
import getColors from "@/utils/getColors";

Chart.register(...registerables);

export default defineComponent({
  components: { PieChart },
  setup() {
    const data = ref<RecordState[]>([]);

    StatisticService.getRecordStates().then((d) => (data.value = d));

    const chartData = computed(() => ({
      labels: data.value.map((i) => i.state),
      datasets: [
        {
          label: "Amount",
          data: data.value.map((i) => i.amount),
          backgroundColor: getColors(data.value.length),
        },
      ],
    }));

    return { chartData };
  },
});
</script>

<template>
  <PieChart :chart-data="chartData" />
</template>
