<template>
  <ButtonNormal
    kind="primary"
    @click="createMailUserRole({ action: 'mail/create_user' })"
  >
    Create my mail user role
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest: createMailUserRole } = useCmd(query.value);
</script>
