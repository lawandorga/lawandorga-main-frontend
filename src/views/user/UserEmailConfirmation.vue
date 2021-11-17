<template>
  <div class="max-w-2xl mx-auto bg-white shadow px-4 pt-4 pb-6 mt-12">
    <h2 class="text-2xl font-medium mb-4">E-Mail Confirmation</h2>
    <div v-if="loading" class="text-lg">
      <p>One Moment please, we are checking the confirmation link.</p>
      <CircleLoader />
    </div>
    <div v-if="success" class="text-lg">
      E-Mail confirmation successful. You can login now.
      <br />
      <br />
      <router-link :to="{ name: 'user-login' }" class="underline">
        > Login
      </router-link>
    </div>
    <div v-else class="text-lg">
      Something went wrong. Maybe your email is already confirmed. Please try to
      login. If that doesn't work, please contact us on
      <a href="mailto:it@law-orga.de" class="underline">it@law-orga.de</a>
      <span>.</span>
      <br />
      <br />
      <router-link :to="{ name: 'user-login' }" class="underline">
        > Login
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import UserService from "@/services/user";
import { useRoute } from "vue-router";
import CircleLoader from "@/components/CircleLoader.vue";

export default defineComponent({
  components: { CircleLoader },
  setup() {
    const success = ref(false);
    const loading = ref(true);
    const route = useRoute();

    onMounted(() => {
      UserService.confirmEmail({
        user: route.params.user as string,
        token: route.params.token as string,
      })
        .then(() => (success.value = true))
        .catch(() => (success.value = false))
        .finally(() => (loading.value = false));
    });

    return { loading, success };
  },
});
</script>
