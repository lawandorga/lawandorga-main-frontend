<template>
  <ButtonNormal kind="action" @click="createMailUserRole({})">
    Create my mail user role
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailCreateUser } from "@/services/mail";
import { ButtonNormal } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest: createMailUserRole } = useCommand(
  mailCreateUser,
  query.value,
);
</script>
