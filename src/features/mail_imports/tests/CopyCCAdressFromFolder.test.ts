import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import CopyCCAdressFromFolder from "../actions/CopyCCAdressFromFolder.vue";

describe("CopyCCAdressFromFolder", () => {
  const wrapper = mount(CopyCCAdressFromFolder, {
    props: {
      address: "123456@folders.law-orga.de",
    },
    global: {
      plugins: [createTestingPinia()],
    },
  });

  it("should be rendered correctly", () => {
    expect(wrapper.text()).toContain("Copy email address");
  });

  it("should copy the address", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.mock,
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Copied");
  });
});
