import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { expect, it, vi } from "vitest";
import { Ref } from "vue";
import CopyCCAdressFromFolder from "../actions/CopyCCAdressFromFolder.vue";

describe("CopyCCAdressFromFolder", () => {
  const wrapper = mount(CopyCCAdressFromFolder, {
    global: {
      plugins: [createTestingPinia()],
    },
  });

  vi.mock("@/composables/useGet", () => ({
    default: (_func: () => void, parameter: Ref) => {
      parameter.value = "dummy@address.com";
    },
  }));

  it("should be rendered correctly", () => {
    expect(wrapper.text()).toContain("Mail-Adresse kopieren");
  });

  it("should copy the address", async () => {
    const writeText = vi.mock;
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });

    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Kopiert");
  });
});
