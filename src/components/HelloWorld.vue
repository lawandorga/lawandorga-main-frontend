<template>
  <div class="prose mx-auto max-w-lg">
    <h1 class="text-2xl font-bold mb-6">{{ msg }}</h1>
    <p>
      This is my personal starter for Vue 3 projects that require typescript
      support.
    </p>
    <h2>Included</h2>
    <ul>
      <li>Typescript</li>
      <li>Vite</li>
      <li>Vue 3</li>
      <li>Vuex Store</li>
      <li>Vue Router</li>
      <li>PostCSS</li>
      <li>TailwindCSS</li>
      <li>Headless UI</li>
      <li>Heroicons</li>
      <li>ESLint</li>
      <li>Prettier</li>
      <li>axios</li>
    </ul>
    <h2>Recommended Setup</h2>
    <ul>
      <li>VSCode</li>
      <li>Volar (VSCode Plugin)</li>
    </ul>
    <h2>Hosting</h2>
    <ul>
      <li>Netlify ready</li>
    </ul>
    <h2>Alerts</h2>
    <ul>
      <li>
        <p>
          <button
            class="text-green-500 underline"
            type="button"
            @click="$store.dispatch('alert/createAlerts')"
          >
            Create alerts
          </button>
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{ msg: string }>();
</script>
