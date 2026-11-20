import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";

import CollabForm from "../components/CollabForm.vue";

const commandRequest = vi.fn();

vi.mock("@/composables/useCmd", () => ({
  default: () => ({ commandRequest }),
}));

// A lightweight editor: renders the slot (save bar) and a focusable element
// that stands in for the Tiptap content.
const FormTipTapTwoStub = defineComponent({
  name: "FormTipTapTwo",
  props: { modelValue: { type: String, required: true } },
  emits: ["update:modelValue", "ready"],
  setup(_, { slots }) {
    return () =>
      h("div", [
        slots.default?.(),
        h("div", {
          "data-test": "editor",
          contenteditable: "true",
          tabindex: 0,
        }),
      ]);
  },
});

const mountComponent = (text = "<p>Hello</p>") =>
  mount(CollabForm, {
    props: { text, collabUuid: "collab-1", password: "secret" },
    attachTo: document.body,
    global: { stubs: { FormTipTapTwo: FormTipTapTwoStub } },
  });

type Wrapper = ReturnType<typeof mountComponent>;

const type = (wrapper: Wrapper, value: string) =>
  (wrapper.findComponent(FormTipTapTwoStub) as VueWrapper).vm.$emit(
    "update:modelValue",
    value,
  );

const saveButton = (wrapper: Wrapper) =>
  wrapper.get('[data-test="collab-save-button"]');

const statusText = (wrapper: Wrapper) =>
  wrapper.get('[data-test="collab-save-status"]').text();

describe("CollabForm", () => {
  let wrapper: Wrapper;

  beforeEach(() => {
    commandRequest.mockReset();
    commandRequest.mockResolvedValue({});
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("save bar", () => {
    it("is inactive but focusable when everything is saved", () => {
      wrapper = mountComponent();
      const button = saveButton(wrapper);

      expect(statusText(wrapper)).toContain("All changes saved");
      expect(button.attributes("aria-disabled")).toBe("true");
      expect(button.attributes("disabled")).toBeUndefined();
      expect(button.attributes("title")).toBe("No unsaved changes");
      expect(button.attributes("aria-keyshortcuts")).toBe("Control+S Meta+S");
    });

    it("ignores clicks while inactive", async () => {
      wrapper = mountComponent();
      await saveButton(wrapper).trigger("click");
      expect(commandRequest).not.toHaveBeenCalled();
    });

    it("saves on click when there are unsaved changes", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      expect(statusText(wrapper)).toContain("Unsaved changes");
      expect(saveButton(wrapper).attributes("aria-disabled")).toBeUndefined();

      await saveButton(wrapper).trigger("click");
      await flushPromises();

      expect(commandRequest).toHaveBeenCalledTimes(1);
      expect(statusText(wrapper)).toMatch(/Saved at \d{2}:\d{2}/);
    });

    it("does not show saved before the server confirmed", async () => {
      let resolve!: () => void;
      commandRequest.mockReturnValueOnce(
        new Promise<void>((res) => (resolve = res)),
      );
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      await saveButton(wrapper).trigger("click");
      expect(statusText(wrapper)).toContain("Saving…");
      expect(statusText(wrapper)).not.toContain("Saved");
      expect(saveButton(wrapper).attributes("aria-disabled")).toBe("true");

      resolve();
      await flushPromises();
      expect(statusText(wrapper)).toContain("Saved at");
    });

    it("shows the error state with a retry button when saving fails", async () => {
      commandRequest.mockRejectedValueOnce({ title: "Network Error" });
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      await saveButton(wrapper).trigger("click");
      await flushPromises();

      expect(statusText(wrapper)).toContain("Not saved");
      expect(statusText(wrapper)).toContain(
        "Your text is still here. Try again.",
      );
      expect(saveButton(wrapper).text()).toContain("Retry");
      expect(saveButton(wrapper).attributes("aria-disabled")).toBeUndefined();
    });
  });

  describe("keyboard shortcut", () => {
    it.each([
      ["Ctrl+S", { ctrlKey: true }],
      ["Cmd+S", { metaKey: true }],
    ])(
      "%s inside the editor saves and prevents the browser dialog",
      async (_, modifier) => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");

        const event = new KeyboardEvent("keydown", {
          key: "s",
          bubbles: true,
          cancelable: true,
          ...modifier,
        });
        wrapper.get('[data-test="editor"]').element.dispatchEvent(event);
        await flushPromises();

        expect(event.defaultPrevented).toBe(true);
        expect(commandRequest).toHaveBeenCalledTimes(1);
      },
    );

    it("does not react to Ctrl+S outside of the collab", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      const event = new KeyboardEvent("keydown", {
        key: "s",
        ctrlKey: true,
        bubbles: true,
        cancelable: true,
      });
      document.body.dispatchEvent(event);
      await flushPromises();

      expect(event.defaultPrevented).toBe(false);
      expect(commandRequest).not.toHaveBeenCalled();
    });
  });
});
