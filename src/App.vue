<template>
  <div>
    <div class="flex h-screen overflow-hidden print:h-auto print:overflow-auto">
      <NavigationMobile :open="menuOpen" :set-open="setMenuOpen" />

      <NavigationSidebar v-if="authenticated && inside" />

      <div class="flex flex-col flex-1 w-0 overflow-hidden">
        <NavigationTop v-if="authenticated" :set-open="setMenuOpen" />

        <!-- <div
          class="px-5 py-2 font-bold leading-none text-center text-orange-900 bg-orange-300"
        >
          Updates in progress. Errors can happen. We will be back to normal
          functionality soon.
        </div> -->

        <NavigationDefault v-if="!authenticated" />

        <!-- Main Panel -->
        <main
          class="relative flex-1 px-6 py-6 overflow-y-auto focus:outline-none"
        >
          <!-- <div class="px-6" :class="{ 'py-6': authenticated }"> -->
          <router-view></router-view>
          <!-- </div> -->
        </main>
      </div>
    </div>
    <AlertList
      :alerts="$store.getters['alert/alerts']"
      @close="$store.dispatch('alert/closeAlert', $event)"
    />
  </div>
</template>

<script lang="ts">
import NavigationDefault from "@/components/NavigationDefault.vue";
import { defineComponent } from "vue";
import { AlertList } from "@lawandorga/components";
import NavigationSidebar from "./components/NavigationSidebar.vue";
import NavigationTop from "./components/NavigationTop.vue";
import NavigationMobile from "./components/NavigationMobile.vue";

export default defineComponent({
  components: {
    AlertList,
    NavigationTop,
    NavigationDefault,
    NavigationMobile,
    NavigationSidebar,
  },
  data: function () {
    return {
      menuOpen: false,
      mobileMenuOpen: false,
    };
  },
  computed: {
    authenticated(): boolean {
      return this.$store.getters["user/isAuthenticated"];
    },
    inside(): boolean {
      return this.$route.name !== "user-login";
    },
  },
  methods: {
    setMenuOpen(open: boolean) {
      this.menuOpen = open;
    },
  },
});
</script>
