<script setup lang="ts">
import { ChartBarIcon } from "@heroicons/vue/24/outline";

import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import StatisticActiveUsers from "@/features/statistics/components/ActiveUsers.vue";
import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import StatisticRecordsCreatedAndClosed from "@/features/statistics/components/RecordsCreatedAndClosed.vue";
import StatisticRecordStates from "@/features/statistics/components/RecordStates.vue";
import StatisticRecordTags from "@/features/statistics/components/RecordTags.vue";

import CreatedRecords from "../components/CreatedRecords.vue";
import DataSheetStatisticFieldsStats from "../components/DataSheetStatisticFieldsStats.vue";
</script>

<template>
  <div>
    <BreadcrumbsBar
      class="lg:col-span-2"
      :base="{ name: 'dashboard' }"
      :pages="[]"
    >
      <ChartBarIcon class="h-6 w-6" />
    </BreadcrumbsBar>
  </div>
  <div class="mt-6 grid grid-cols-12 gap-4">
    <StatisticChartWrapper
      title="Most Active Users In The Last 30 Days"
      class="col-span-12"
    >
      <StatisticActiveUsers />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Created Records"
      class="col-span-12 bg-gray-100!"
    >
      <CreatedRecords />
    </StatisticChartWrapper>
    <DataSheetStatisticFieldsStats />
    <StatisticRecordsCreatedAndClosed />
    <StatisticChartWrapper
      title="Different Data Sheet States"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticRecordStates />
    </StatisticChartWrapper>
    <StatisticRecordTags />
  </div>
</template>
