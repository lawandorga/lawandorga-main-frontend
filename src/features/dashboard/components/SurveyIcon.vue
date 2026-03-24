<script setup lang="ts">
defineProps<{ size: number }>();
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="103 103 1294 1294"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="750" cy="750" r="647" fill="#ffffff" />
    <path
      fill="currentColor"
      d="M616 487L884 487C893 487 901 479 901 470L901 419C901 409 893 402 884 402L815 402C809 402 804 397 804 390L804 389C804 360 780 336 750 336C720 336 697 360 697 389L697 390C697 397 692 402 685 402L617 402C607 402 599 410 599 419L599 470C599 479 607 487 616 487Z"
    />
    <rect
      x="500"
      y="487"
      width="500"
      height="710"
      rx="30"
      fill="none"
      stroke="currentColor"
      stroke-width="32"
    />
    <rect x="526" y="756" width="196" height="196" rx="8" fill="currentColor" />
    <rect x="526" y="584" width="196" height="196" rx="8" fill="currentColor" />
    <rect x="742" y="598" width="260" height="22" rx="11" fill="currentColor" />
    <rect
      x="742"
      y="632"
      width="180"
      height="17"
      rx="8"
      fill="currentColor"
      fill-opacity="0.35"
    />
    <rect x="742" y="770" width="260" height="22" rx="11" fill="currentColor" />
    <rect
      x="742"
      y="804"
      width="180"
      height="17"
      rx="8"
      fill="currentColor"
      fill-opacity="0.35"
    />
    <circle cx="624" cy="661" r="30" fill="#fff" />
    <path
      d="M608 661L621 674L642 651"
      stroke="currentColor"
      stroke-width="18"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
    <circle cx="624" cy="833" r="30" fill="#fff" />
    <path
      d="M608 833L621 846L642 823"
      stroke="currentColor"
      stroke-width="18"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </svg>
</template>
