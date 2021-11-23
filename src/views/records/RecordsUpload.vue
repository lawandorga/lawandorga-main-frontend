<template>
  <div class="max-w-2xl bg-white shadow px-5 py-4 rounded mx-auto">
    <h2 class="text-xl font-bold">Enter the upload area</h2>
    <p class="text-lg text-gray-700">
      Please enter the code you have been given. If a questionnaire has the
      entered code you will be redirected to the upload area.
    </p>
    <div class="pt-5">
      <form @submit.prevent="next()">
        <FormInput v-model="code" label="Code" required name="code"></FormInput>
        <div class="mt-4 flex justify-end">
          <ButtonNormal type="submit">Enter</ButtonNormal>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/runtime-core";
import FormInput from "@/components/FormInput.vue";
import { useRouter } from "vue-router";
import ButtonNormal from "@/components/ButtonNormal.vue";

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
