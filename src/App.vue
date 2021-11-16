<template>
  <div class="h-screen flex overflow-hidden">
    <NavigationMobile :open="menuOpen" :set-open="setMenuOpen" />

    <NavigationSidebar v-if="authenticated" />

    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <NavigationTop v-if="authenticated" :set-open="setMenuOpen" />

      <NavigationDefault v-if="!authenticated && false" />

      <!-- Main Panel -->
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="px-6" :class="{ 'py-6': authenticated }">
          <router-view></router-view>
        </div>
      </main>
    </div>
  </div>
  <AlertList />
</template>

<script lang="ts">
import NavigationDefault from "@/components/NavigationDefault.vue";
import AlertList from "@/components/AlertList.vue";
import { defineComponent } from "vue";
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
    authenticated() {
      return this.$store.getters["user/isAuthenticated"];
    },
  },
  methods: {
    setMenuOpen(open: boolean) {
      this.menuOpen = open;
    },
  },
});
</script>
