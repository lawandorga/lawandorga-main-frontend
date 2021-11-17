<template>
  <div class="max-w-lg mx-auto bg-white shadow px-4 pt-4 pb-6 mt-12">
    <h2 class="text-2xl font-medium mb-4">Reset Password</h2>
    <div v-if="!success" class="">
      <FormGenerator
        :fields="fields"
        :request="reset"
        submit="Request Password Reset"
        @success="success = true"
      />
    </div>
    <div v-if="success" class="prose">
      <p>We've sent you an email to reset your password.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import FormGenerator from "@/components/FormGenerator.vue";
import UserService from "@/services/user";

export default defineComponent({
  components: {
    FormGenerator,
  },
  setup() {
    const fields = ref([
      {
        label: "E-Mail",
        name: "email",
        type: "email",
        required: true,
      },
    ]);
    const success = ref(false);

    return { fields, reset: UserService.requestPasswordReset, success };
  },
});
</script>
