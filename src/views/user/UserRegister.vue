<template>
  <div class="max-w-2xl mx-auto bg-white shadow px-4 pt-4 pb-6 mt-12">
    <h2 class="text-2xl font-medium mb-4">Register</h2>
    <div v-if="!success" class="">
      <FormGenerator
        :fields="fields"
        :request="register"
        submit="Register"
        @success="success = true"
      />
    </div>
    <div v-if="success" class="prose">
      <p>
        Your account was created. 2 things need to happen before you can login:
      </p>
      <ol>
        <li>An admin from your LC needs to accept you as a member.</li>
        <li>
          You need to confirm your email. We've sent you an email to do that.
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import FormGenerator from "@/components/FormGenerator.vue";
import UserService from "@/services/user";
import { Rlc } from "@/types/core";

export default defineComponent({
  components: {
    FormGenerator,
  },
  setup() {
    const fields = ref([
      {
        label: "RLC",
        name: "rlc",
        type: "select",
        options: [] as Rlc[],
        required: true,
      },
      {
        label: "E-Mail",
        name: "email",
        type: "email",
        required: true,
      },
      {
        label: "Name",
        name: "name",
        type: "text",
        required: true,
      },
      {
        label: "Password",
        name: "password",
        type: "password",
        required: true,
      },
      {
        label: "Password Confirm",
        name: "password_confirm",
        type: "password",
        required: true,
      },
    ]);
    const success = ref(false);

    UserService.getRlcs().then((rlcs) => (fields.value[0].options = rlcs));

    return { fields, register: UserService.register, success };
  },
});
</script>
