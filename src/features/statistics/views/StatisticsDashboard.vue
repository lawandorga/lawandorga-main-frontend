<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { ChartBarIcon } from "@heroicons/vue/24/outline";
import StatisticRecordStates from "@/features/statistics/components/RecordStates.vue";
import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import StatisticRecordTags from "@/features/statistics/components/RecordTags.vue";
import StatisticActiveUsers from "@/features/statistics/components/ActiveUsers.vue";
import StatisticRecordsCreatedAndClosed from "@/features/statistics/components/RecordsCreatedAndClosed.vue";
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
      <ChartBarIcon class="w-6 h-6" />
    </BreadcrumbsBar>
  </div>
  <div class="grid grid-cols-12 gap-4 mt-6">
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
