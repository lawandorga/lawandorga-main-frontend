<template>
  <div class="max-w-lg px-4 pt-4 pb-6 mx-auto mt-12 bg-white shadow">
    <h2 class="mb-4 text-2xl font-medium">Reset Password</h2>
    <p class="text-base">
      Only use this if you have actually forgotten your password. Your account
      will be locked after a password forgotten process and an admin needs to
      unlock you. That's the case because your encryption keys need to be
      resetted.
      <br />
      <b>
        You can also change your password within Law&Orga on your personal
        profile.
      </b>
    </p>
    <div v-if="!success" class="mt-8">
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
import { FormGenerator } from "@lawandorga/components";
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
