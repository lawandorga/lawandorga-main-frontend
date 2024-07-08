<script></script>

<template>
  <div class="aspect-[1/1.41] bg-gray-100 flex flex-col justify-between">
    <div class="p-4 text-xs bg-gray-200 min-h-10">
      <slot name="header"></slot>
    </div>
    <div class="grid grid-cols-4 gap-4 p-4 text-xs bg-gray-200 min-h-10">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
