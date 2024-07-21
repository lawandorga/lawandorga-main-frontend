<script></script>

<template>
  <div class="aspect-[1/1.41] bg-white flex flex-col justify-between shadow-md">
    <div class="p-4 text-xs bg-zinc-300 min-h-[15%]">
      <slot name="header"></slot>
    </div>
    <div class="grid grid-cols-4 gap-4 p-4 text-xs bg-zinc-300 min-h-[7%]">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
