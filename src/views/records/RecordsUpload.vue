<template>
  <div class="max-w-2xl px-5 py-4 mx-auto bg-white rounded shadow">
    <h2 class="text-xl font-bold">Enter the upload area</h2>
    <p class="text-lg text-gray-700">
      Please enter the code you have been given. If a questionnaire has the
      entered code you will be redirected to the upload area.
    </p>
    <div class="pt-5">
      <form @submit.prevent="next()">
        <FormInput v-model="code" label="Code" required name="code"></FormInput>
        <div class="flex justify-end mt-4">
          <ButtonNormal type="submit">Enter</ButtonNormal>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import { FormInput } from "@lawandorga/components";
import { useRouter } from "vue-router";
import { ButtonNormal } from "@lawandorga/components";

export default defineComponent({
  components: {
    ButtonNormal,
    FormInput,
  },
  setup() {
    const code = ref("");
    const router = useRouter();

    const next = () =>
      router.push({
        name: "records-questionnaire",
        params: { code: code.value.toUpperCase() },
      });

    return {
      next,
      code,
    };
  },
});
</script>
