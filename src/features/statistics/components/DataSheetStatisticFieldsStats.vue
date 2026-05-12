<script lang="ts" setup>
import { Chart, registerables } from "chart.js";
import { CircleLoader, FormSelect } from "lorga-ui";
import { ref, computed } from "vue";
import { PieChart } from "vue-chart-3";

import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import getColors from "@/utils/getColors";

import { useDataSheetStatisticFieldStats } from "../api/useDataSheetStatisticFieldStats";

Chart.register(...registerables);

const year = ref<number>();
const { stats, formYears } = useDataSheetStatisticFieldStats(year);

const charts = computed(() => {
  return Object.keys(stats.value).map((key) => {
    const s = stats.value[key as string];
    return {
      chart: key,
      data: {
        labels: Object.keys(s),
        datasets: [
          {
            label: "Count",
            data: Object.values(s),
            backgroundColor: getColors(Object.keys(s).length),
          },
        ],
      },
    };
  });
});
</script>

<template>
  <StatisticChartWrapper
    title="Data Sheet Statistic Field Stats"
    class="col-span-12 bg-gray-100!"
  >
    <div class="col-span-12 grid grid-cols-12 gap-4">
      <template v-for="c in charts" :key="c.chart">
        <StatisticChartWrapper
          :title="c.chart"
          class="relative col-span-12 lg:col-span-6"
        >
          <CircleLoader v-if="stats === undefined" />
          <PieChart :chart-data="c.data" />
          <div class="absolute top-3 right-5 w-32">
            <FormSelect v-model="year" :options="formYears" label="" required />
          </div>
        </StatisticChartWrapper>
      </template>
    </div>
  </StatisticChartWrapper>
</template>
