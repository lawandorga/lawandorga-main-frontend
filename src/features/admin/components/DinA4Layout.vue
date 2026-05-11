<script></script>

<template>
  <div class="flex aspect-[1/1.41] flex-col justify-between bg-white shadow-md">
    <div class="flex min-h-[15%] justify-between bg-zinc-300 p-4 text-xs">
      <slot name="header"></slot>
    </div>
    <div class="grid min-h-[7%] grid-cols-4 gap-4 bg-zinc-300 p-4 text-xs">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
