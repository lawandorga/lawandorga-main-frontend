<script setup lang="ts">
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { ChartBarIcon } from "@heroicons/vue/24/outline";
import StatisticRecordStates from "@/features/statistics/components/RecordStates.vue";
import StatisticChartWrapper from "@/features/statistics/components/ChartWrapper.vue";
import StatisticRecordTags from "@/features/statistics/components/RecordTags.vue";
import StatisticClientSex from "@/features/statistics/components/ClientSex.vue";
import StatisticClientAge from "@/features/statistics/components/ClientAge.vue";
import StatisticClientNationality from "@/features/statistics/components/ClientNationality.vue";
import StatisticClientState from "@/features/statistics/components/ClientState.vue";
import StatisticActiveUsers from "@/features/statistics/components/ActiveUsers.vue";
import StatisticRecordsCreatedAndClosed from "@/features/statistics/components/RecordsCreatedAndClosed.vue";
import CreatedRecords from "../components/CreatedRecords.vue";
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
    <StatisticChartWrapper title="Created Records" class="col-span-12">
      <CreatedRecords />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Most Active Users In The Last 30 Days"
      class="col-span-12"
    >
      <StatisticActiveUsers />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Data Sheets Created And Closed"
      class="col-span-12"
    >
      <StatisticRecordsCreatedAndClosed />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Different Data Sheet States"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticRecordStates />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Data Sheet Tags"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticRecordTags />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Data Sheet Client Sex"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientSex />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Data Sheet Client Age"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientAge />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Data Sheet Client Nationality"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientNationality />
    </StatisticChartWrapper>
    <StatisticChartWrapper
      title="Data Sheet Client State"
      class="col-span-12 xl:col-span-6"
    >
      <StatisticClientState />
    </StatisticChartWrapper>

    <StatisticChartWrapper title="Ideas?" class="col-span-12 xl:col-span-6">
      <p class="prose">
        If you've got any ideas for more statistic or anything you need, feel
        free to email us at
        <a href="mailto:it@law-orga.de">it@law-orga.de</a>
        <span>.</span>
      </p>
    </StatisticChartWrapper>
  </div>
</template>
