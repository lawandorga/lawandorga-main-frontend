<script lang="ts" setup>
import { Chart, registerables } from "chart.js";
import { CircleLoader, FormSelect } from "lorga-ui";
import { ref, computed } from "vue";
import { BarChart } from "vue-chart-3";

import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import getColors from "@/utils/getColors";

import { useCreatedAndClosed } from "../api/useCreatedAndClosed";

Chart.register(...registerables);

const year = ref();
const { stats, formYears } = useCreatedAndClosed(year);

const chartData = computed(() => ({
  labels: stats.value.map((i) => i.month),
  datasets: [
    {
      label: "Created",
      data: stats.value.map((i) => i.created),
      backgroundColor: getColors(1),
    },
    {
      label: "Closed",
      data: stats.value.map((i) => i.closed),
      backgroundColor: getColors(2).slice(1),
    },
  ],
}));
</script>

<template>
  <StatisticChartWrapper
    title="Data Sheets Created And Closed"
    class="relative col-span-12"
  >
    <div class="absolute top-3 right-5 z-20 w-32">
      <FormSelect v-model="year" :options="formYears" label="" required />
    </div>
    <CircleLoader v-if="stats === undefined" />
    <BarChart :chart-data="chartData" />
  </StatisticChartWrapper>
</template>
