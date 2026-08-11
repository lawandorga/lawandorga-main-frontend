import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import BoxSection from "../BoxSection.vue";

const mountBoxSection = (props: { title: string; numberOfItems?: number }) =>
  mount(BoxSection, {
    props,
    slots: { default: "<p>Panel content</p>" },
  });

test("starts open and shows its content", () => {
  const wrapper = mountBoxSection({ title: "Follow Ups" });

  expect(wrapper.text()).toContain("Panel content");
  expect(wrapper.get("button").attributes("aria-expanded")).toBe("true");
});

test("hides its content when the heading is clicked", async () => {
  const wrapper = mountBoxSection({ title: "Follow Ups" });

  const toggle = wrapper.get("button");
  const panelId = toggle.attributes("aria-controls");

  await toggle.trigger("click");
  await nextTick();

  expect(wrapper.get(`#${panelId}`).attributes("style")).toContain(
    "display: none",
  );
  expect(toggle.attributes("aria-expanded")).toBe("false");
});

test("shows the content again when the heading is clicked twice", async () => {
  const wrapper = mountBoxSection({ title: "Follow Ups" });

  await wrapper.get("button").trigger("click");
  await wrapper.get("button").trigger("click");
  await nextTick();

  expect(wrapper.get("button").attributes("aria-expanded")).toBe("true");
});

test("the toggle points at the panel it controls", () => {
  const wrapper = mountBoxSection({ title: "Follow Ups" });

  const controlledId = wrapper.get("button").attributes("aria-controls");
  expect(controlledId).toBeTruthy();
  expect(wrapper.get(`#${controlledId}`).text()).toContain("Panel content");
});

test("shows a count when there are items", () => {
  const wrapper = mountBoxSection({ title: "Follow Ups", numberOfItems: 3 });

  expect(wrapper.text()).toContain("3");
});

test("shows no count for an empty list", () => {
  const wrapper = mountBoxSection({ title: "Follow Ups", numberOfItems: 0 });

  expect(wrapper.text()).not.toContain("0");
});
