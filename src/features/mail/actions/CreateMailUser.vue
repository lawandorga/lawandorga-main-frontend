<script setup lang="ts">
import { ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";

import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
}>();
const { query } = toRefs(props);

const { commandRequest: createMailUserRole } = useCmd(query.value);
</script>

<template>
  <ButtonNormal
    kind="primary"
    @click="createMailUserRole({ action: 'mail/create_user' })"
  >
    Create my mail user role
  </ButtonNormal>
</template>
