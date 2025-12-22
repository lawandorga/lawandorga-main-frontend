<script lang="ts" setup>
import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import { ref, computed } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";
import getColors from "@/utils/getColors";
import { CircleLoader, FormSelect } from "lorga-ui";
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
  <template v-for="c in charts" :key="c.chart">
    <StatisticChartWrapper
      :title="c.chart"
      class="relative col-span-12 lg:col-span-6"
    >
      <div class="absolute z-20 w-32 top-3 right-5">
        <FormSelect v-model="year" :options="formYears" label="" required />
      </div>
      <CircleLoader v-if="stats === undefined" />
      <BarChart :chart-data="c.data" />
    </StatisticChartWrapper>
  </template>
</template>
