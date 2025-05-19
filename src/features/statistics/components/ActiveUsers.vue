<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import getColors from "@/utils/getColors";
import StatisticService from "@/features/statistics/statistic";
import { UserAction } from "@/features/statistics/types";

Chart.register(...registerables);

export default defineComponent({
  components: { BarChart },
  setup() {
    const data = ref<UserAction[]>([]);

    StatisticService.getUserActionsMonth().then((d) => (data.value = d));

    const chartData = computed(() => ({
      labels: data.value.map((i) => i.email),
      datasets: [
        {
          label: "Actions",
          data: data.value.map((i) => i.actions),
          backgroundColor: getColors(1),
        },
      ],
    }));

    return { chartData };
  },
});
</script>

<template>
  <BarChart :chart-data="chartData" />
</template>
