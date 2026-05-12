<script lang="ts" setup>
import { Chart, registerables } from "chart.js";
import { CircleLoader, FormSelect } from "lorga-ui";
import { computed, ref } from "vue";
import { PieChart } from "vue-chart-3";

import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import getColors from "@/utils/getColors";

import { useRecordTags } from "../api/useRecordTags";

Chart.register(...registerables);

const year = ref();
const { stats, formYears } = useRecordTags(year);

const chartData = computed(() => {
  if (!stats.value) return { labels: [], datasets: [] };
  return {
    labels: Object.keys(stats.value),
    datasets: [
      {
        label: "Amount",
        data: Object.values(stats.value),
        backgroundColor: getColors(Object.keys(stats.value).length),
      },
    ],
  };
});
</script>

<template>
  <StatisticChartWrapper
    title="Data Sheet Tags"
    class="relative col-span-12 xl:col-span-6"
  >
    <div class="absolute top-3 right-5 z-20 w-32">
      <FormSelect v-model="year" :options="formYears" label="" required />
    </div>
    <CircleLoader v-if="stats === undefined" />
    <PieChart v-else :chart-data="chartData" />
  </StatisticChartWrapper>
</template>
