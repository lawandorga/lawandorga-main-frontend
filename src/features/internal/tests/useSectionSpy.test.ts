import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";

import { useSectionSpy } from "../composables/useSectionSpy";

const place = (id: string, top: number, bottom: number) => {
  const el = document.createElement("section");
  el.id = id;
  el.getBoundingClientRect = () =>
    ({ top, bottom, left: 0, right: 0, width: 0, height: 0 }) as DOMRect;
  document.body.appendChild(el);
  return el;
};

describe("useSectionSpy", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("reports the section at the reading line", () => {
    // jsdom: innerHeight 768 → reading line 256
    place("einblick", -500, 200);
    place("sicherheit", 200, 1200);

    let spy: ReturnType<typeof useSectionSpy> | undefined;
    const wrapper = mount(
      defineComponent({
        setup() {
          spy = useSectionSpy(["einblick", "sicherheit"]);
          return () => h("div");
        },
      }),
    );

    expect(spy?.activeId.value).toBe("sicherheit");
    wrapper.unmount();
  });

  it("reports nothing when disabled", () => {
    place("einblick", 0, 1000);

    let spy: ReturnType<typeof useSectionSpy> | undefined;
    const wrapper = mount(
      defineComponent({
        setup() {
          spy = useSectionSpy(["einblick"], false);
          return () => h("div");
        },
      }),
    );

    expect(spy?.activeId.value).toBeUndefined();
    wrapper.unmount();
  });
});
