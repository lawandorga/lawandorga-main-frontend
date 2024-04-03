import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import CopyCCAdressFromFolder from "../actions/CopyCCAdressFromFolder.vue";

describe("CopyCCAdressFromFolder", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  const wrapper = mount(CopyCCAdressFromFolder, {
    props: {
      address: "123456@folders.law-orga.de",
    },
    global: {
      plugins: [createTestingPinia()],
    },
  });

  Object.assign(navigator, {
    clipboard: {
      writeText: vi.mock,
    },
  });

  it("should be rendered correctly", () => {
    expect(wrapper.text()).toContain("Copy email address");
  });

  it("should copy the address", async () => {
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Copied");
  });

  it("should revert to the original button", async () => {
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Copied");

    await vi.advanceTimersByTime(1000);
    expect(wrapper.text()).toContain("Copy");
  });
});
