<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

import { FeatureArea } from "@/features/internal/api/useLoginPage";
import {
  DEFAULT_SCREENSHOT_NOTE,
  getActiveStep,
  prefersReducedMotion,
} from "@/features/internal/utils/landing";

const props = defineProps<{ areas: FeatureArea[] }>();

const stepsRoot = ref<HTMLElement | null>(null);
const activeId = ref<number | null>(null);

const active = computed<FeatureArea | undefined>(() => {
  return (
    props.areas.find((area) => area.id === activeId.value) ?? props.areas[0]
  );
});

const stepElements = (): HTMLElement[] => {
  if (!stepsRoot.value) return [];
  return Array.from(
    stepsRoot.value.querySelectorAll<HTMLElement>("[data-step]"),
  );
};

const onScroll = () => {
  const steps = stepElements().map((el) => ({
    id: el.dataset.step as string,
    top: el.getBoundingClientRect().top,
  }));
  const id = getActiveStep(steps, window.innerHeight);
  if (id !== undefined) activeId.value = Number(id);
};

const goTo = (area: FeatureArea) => {
  const el = stepElements().find((s) => s.dataset.step === String(area.id));
  el?.scrollIntoView?.({
    block: "center",
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
  activeId.value = area.id;
};

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
});

// data arrives after mount
watch(
  () => props.areas,
  () => nextTick(onScroll),
);
</script>

<template>
  <div
    v-if="areas.length"
    class="mt-6 grid grid-cols-1 items-start gap-0 min-[981px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] min-[981px]:gap-16"
  >
    <div ref="stepsRoot">
      <div
        v-for="area in areas"
        :key="area.id"
        :data-step="area.id"
        class="flex min-h-[34vh] flex-col justify-center py-8 min-[981px]:min-h-[56vh]"
      >
        <img
          v-if="area.icon_url"
          :src="area.icon_url"
          alt=""
          class="block size-16 transition-[filter,opacity] duration-200"
          :class="area.id === active?.id ? '' : 'opacity-55 grayscale'"
        />
        <h3 class="mt-[18px] mb-0">
          <button
            type="button"
            aria-controls="showroom-panel"
            :aria-current="area.id === active?.id ? 'true' : undefined"
            class="hover:text-lo-petrol hover:decoration-lo-accent min-h-11 cursor-pointer scroll-mt-[300px] border-0 bg-transparent p-0 text-left text-[clamp(26px,2.4vw,34px)] leading-[1.15] font-extrabold tracking-[-0.025em] underline decoration-[5px] underline-offset-[10px] transition-colors min-[981px]:scroll-mt-0 [@media(max-height:640px)]:scroll-mt-0"
            :class="
              area.id === active?.id
                ? 'text-lo-petrol decoration-lo-accent'
                : 'text-lo-inactive decoration-transparent'
            "
            @click="goTo(area)"
          >
            {{ area.title }}
          </button>
        </h3>
        <p
          class="mt-[18px] mb-0 max-w-[28em] text-lg leading-[1.6]"
          :class="
            area.id === active?.id ? 'text-lo-text-2' : 'text-lo-inactive'
          "
        >
          {{ area.description }}
        </p>
      </div>
    </div>

    <figure
      v-if="active"
      class="border-lo-line sticky top-0 z-[2] order-first -mx-5 my-0 border-b bg-white px-5 pt-3 pb-2 min-[981px]:top-[calc(50vh-300px)] min-[981px]:order-none min-[981px]:mx-0 min-[981px]:border-0 min-[981px]:p-0 [@media(max-height:640px)]:static"
    >
      <div
        id="showroom-panel"
        class="overflow-hidden rounded-[10px] border border-[#BCC8CA] bg-white shadow-[0_40px_80px_-48px_rgba(0,40,52,0.55)]"
      >
        <div
          v-if="active.screenshot_url"
          class="flex h-[263px] items-center justify-center rounded-[9px] bg-[#EBEDF0] p-2.5 min-[981px]:h-[526px] min-[981px]:p-[18px]"
        >
          <img
            :src="active.screenshot_url"
            :alt="active.screenshot_alt"
            class="block max-h-full max-w-full rounded-md object-contain shadow-[0_2px_8px_rgba(0,30,40,0.12)]"
          />
        </div>
        <div
          v-else
          class="flex h-[263px] flex-col items-center justify-center gap-4 rounded-[9px] bg-[#EBEDF0] p-6 text-center min-[981px]:h-[526px]"
        >
          <img
            v-if="active.icon_url"
            :src="active.icon_url"
            alt=""
            class="block size-24 min-[981px]:size-40"
          />
          <p
            class="text-lo-petrol m-0 text-2xl font-extrabold tracking-[-0.02em] min-[981px]:text-[34px]"
          >
            {{ active.title }}
          </p>
        </div>
      </div>
      <figcaption
        v-if="active.screenshot_url"
        class="text-lo-muted mt-4 hidden text-[15px] min-[981px]:block"
      >
        {{ active.screenshot_note || DEFAULT_SCREENSHOT_NOTE }}
      </figcaption>
    </figure>
  </div>
</template>
