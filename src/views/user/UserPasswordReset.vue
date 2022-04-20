<template>
  <div class="max-w-lg mx-auto bg-white shadow px-4 pt-4 pb-6 mt-12">
    <h2 class="text-2xl font-medium mb-4">Password Reset</h2>
    <div v-if="!success" class="">
      <FormGenerator
        :fields="fields"
        :request="reset"
        :initial="{ user: user, token: token }"
        submit="Save"
        @success="success = true"
      />
    </div>
    <div v-if="success" class="prose">
      <p>
        Your password was reset successfully. However, your new password can not
        decrypt your old encryption keys. Therefore an admin in your LC needs to
        unlock your profile. That way you will get new encryption keys.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { FormGenerator } from "@lawandorga/components";
import UserService from "@/services/user";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    FormGenerator,
  },
  setup() {
    const route = useRoute();
    const fields = ref([
      {
        label: "New Password",
        name: "new_password",
        type: "password",
        required: true,
      },
      {
        label: "New Password Confirm",
        name: "new_password_confirm",
        type: "password",
        required: true,
      },
    ]);
    const success = ref(false);

    return {
      fields,
      reset: UserService.resetPassword,
      success,
      user: route.params.user,
      token: route.params.token,
    };
  },
});
</script>
