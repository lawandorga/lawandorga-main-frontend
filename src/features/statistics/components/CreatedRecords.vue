<script setup lang="ts">
import { TableGenerator } from "lorga-ui";
import { useCreatedRecords } from "../api/useCreatedRecords";

const { data } = useCreatedRecords();

const head = [
  {
    name: "Year",
    key: "year",
  },
  {
    name: "Created",
    key: "created",
  },
];
</script>

<template>
  <div>
    <TableGenerator :data="data" :head="head" />
  </div>
</template>
