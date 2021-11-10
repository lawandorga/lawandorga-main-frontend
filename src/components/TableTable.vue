<template>
  <div class="flex flex-col">
    <div class="-mx-6">
      <div class="px-6 inline-block align-middle min-w-full">
        <div class="shadow rounded-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <slot />
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
