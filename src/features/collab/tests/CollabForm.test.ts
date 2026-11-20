import { EditorContent } from "@tiptap/vue-3";
import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";

import CollabForm from "../components/CollabForm.vue";

const commandRequest = vi.fn();

vi.mock("@/composables/useCmd", () => ({
  default: () => ({ commandRequest }),
}));

type RouteWithSelectedId = { query: { selectedId?: string } };
type GuardResult = Promise<false | undefined> | undefined;
type LeaveGuard = () => GuardResult;
// eslint-disable-next-line no-unused-vars
type UpdateGuard = (to: RouteWithSelectedId) => GuardResult;

// Capture the navigation guards so the tests can trigger them manually
let capturedLeaveGuard: LeaveGuard | null = null;
let capturedUpdateGuard: UpdateGuard | null = null;

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn((guard) => {
      capturedLeaveGuard = guard;
    }),
    onBeforeRouteUpdate: vi.fn((guard) => {
      capturedUpdateGuard = guard;
    }),
  };
});

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
    props: { text, collabUuid: "collab-1" },
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

// the leave dialog is teleported to the body by Headless UI
const leaveDialog = () => document.querySelector('[role="dialog"]');

const clickDialogButton = async (label: string) => {
  const button = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button'),
  ).find((b) => b.textContent?.trim() === label);
  if (!button) throw new Error(`Dialog button "${label}" not found`);
  button.click();
  await flushPromises();
};

const track = (guardResult: GuardResult) => {
  const tracked = { settled: false, value: undefined as false | undefined };
  void Promise.resolve(guardResult).then((value) => {
    tracked.settled = true;
    tracked.value = value;
  });
  return tracked;
};

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

  describe("leaving the collab", () => {
    beforeEach(() => {
      capturedLeaveGuard = null;
      capturedUpdateGuard = null;
    });

    it("leaves without a request when everything is saved", async () => {
      wrapper = mountComponent();

      await expect(capturedLeaveGuard!()).resolves.toBeUndefined();
      expect(commandRequest).not.toHaveBeenCalled();
    });

    it("saves first and allows leaving the page on success", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      await expect(capturedLeaveGuard!()).resolves.toBeUndefined();
      expect(commandRequest).toHaveBeenCalledTimes(1);
      expect(commandRequest).toHaveBeenCalledWith(
        expect.objectContaining({ text: "<p>Hello World</p>" }),
      );
      expect(leaveDialog()).toBeNull();
    });

    it("saves first when switching to another collab or record", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      await expect(
        capturedUpdateGuard!({ query: { selectedId: "collab-2" } }),
      ).resolves.toBeUndefined();
      expect(commandRequest).toHaveBeenCalledTimes(1);
    });

    it("does not save on route updates that stay on this collab", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");

      expect(
        capturedUpdateGuard!({ query: { selectedId: "collab-1" } }),
      ).toBeUndefined();
      expect(commandRequest).not.toHaveBeenCalled();
    });

    it("waits for a request in flight and saves edits made meanwhile", async () => {
      let resolveFirst!: () => void;
      commandRequest.mockReturnValueOnce(
        new Promise<void>((res) => (resolveFirst = res)),
      );
      wrapper = mountComponent();
      await type(wrapper, "<p>First</p>");
      await saveButton(wrapper).trigger("click");
      await type(wrapper, "<p>First and second</p>");

      const navigation = track(capturedLeaveGuard!());
      await flushPromises();
      expect(navigation.settled).toBe(false);

      resolveFirst();
      await flushPromises();

      expect(navigation.settled).toBe(true);
      expect(navigation.value).toBeUndefined();
      expect(commandRequest).toHaveBeenCalledTimes(2);
      expect(commandRequest).toHaveBeenLastCalledWith(
        expect.objectContaining({ text: "<p>First and second</p>" }),
      );
    });

    describe("when saving fails", () => {
      beforeEach(() => {
        commandRequest.mockRejectedValue({ title: "Network Error" });
      });

      it("shows the dialog and blocks navigation until a choice is made", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");

        const navigation = track(capturedLeaveGuard!());
        await flushPromises();

        expect(leaveDialog()?.textContent).toContain(
          "Your changes are not saved",
        );
        expect(leaveDialog()?.textContent).toContain(
          "If you leave now, your last edits are lost.",
        );
        expect(navigation.settled).toBe(false);
      });

      it("allows navigation with Leave without saving", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");
        const navigation = track(capturedLeaveGuard!());
        await flushPromises();

        await clickDialogButton("Leave without saving");

        expect(navigation.settled).toBe(true);
        expect(navigation.value).toBeUndefined();
      });

      it("blocks navigation with Stay here and keeps the text", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");
        const navigation = track(
          capturedUpdateGuard!({ query: { selectedId: "collab-2" } }),
        );
        await flushPromises();

        await clickDialogButton("Stay here");

        expect(navigation.settled).toBe(true);
        expect(navigation.value).toBe(false);
        expect(statusText(wrapper)).toContain("Not saved");
        expect(
          wrapper.findComponent(FormTipTapTwoStub).props("modelValue"),
        ).toBe("<p>Hello World</p>");
      });

      it("treats Escape as Stay here", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");
        const navigation = track(capturedLeaveGuard!());
        await flushPromises();

        document.activeElement?.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );
        await flushPromises();

        expect(navigation.settled).toBe(true);
        expect(navigation.value).toBe(false);
      });

      it("moves focus into the dialog", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");
        void capturedLeaveGuard!();
        await flushPromises();

        expect(leaveDialog()?.contains(document.activeElement)).toBe(true);
      });

      it("leaves after a successful retry", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");
        const navigation = track(capturedLeaveGuard!());
        await flushPromises();

        commandRequest.mockResolvedValue({});
        await clickDialogButton("Try saving again");

        expect(navigation.settled).toBe(true);
        expect(navigation.value).toBeUndefined();
        expect(commandRequest).toHaveBeenCalledTimes(2);
      });

      it("keeps the dialog open when the retry fails again", async () => {
        wrapper = mountComponent();
        await type(wrapper, "<p>Hello World</p>");
        const navigation = track(capturedLeaveGuard!());
        await flushPromises();

        await clickDialogButton("Try saving again");

        expect(commandRequest).toHaveBeenCalledTimes(2);
        expect(navigation.settled).toBe(false);
        expect(leaveDialog()).not.toBeNull();
      });
    });
  });

  describe("closing the tab", () => {
    const fireBeforeUnload = () => {
      const event = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(event);
      return event;
    };

    it("does not warn when everything is saved", () => {
      wrapper = mountComponent();
      expect(fireBeforeUnload().defaultPrevented).toBe(false);
    });

    it("warns while there are unsaved changes", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");
      expect(fireBeforeUnload().defaultPrevented).toBe(true);
    });

    it("warns while saving failed", async () => {
      commandRequest.mockRejectedValueOnce({ title: "Network Error" });
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");
      await saveButton(wrapper).trigger("click");
      await flushPromises();

      expect(statusText(wrapper)).toContain("Not saved");
      expect(fireBeforeUnload().defaultPrevented).toBe(true);
    });

    it("stops warning once the changes are saved", async () => {
      wrapper = mountComponent();
      await type(wrapper, "<p>Hello World</p>");
      await saveButton(wrapper).trigger("click");
      await flushPromises();

      expect(fireBeforeUnload().defaultPrevented).toBe(false);
    });
  });

  describe("unmounting", () => {
    it("sends a pending autosave immediately and removes the warning", async () => {
      const local = mountComponent();
      await type(local, "<p>Hello World</p>");
      expect(commandRequest).not.toHaveBeenCalled();

      local.unmount();

      expect(commandRequest).toHaveBeenCalledTimes(1);
      const event = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("with the real editor", () => {
    // Tiptap rewrites this to "<p>Hello <strong>World</strong></p>"
    const unnormalisedText = "Hello <b>World</b>";

    const mountWithEditor = () =>
      mount(CollabForm, {
        props: {
          text: unnormalisedText,
          collabUuid: "collab-1",
        },
        attachTo: document.body,
        global: { stubs: { FormMenuBar: true } },
      });

    const editorOf = (w: ReturnType<typeof mountWithEditor>) =>
      w.findComponent(EditorContent).props("editor")!;

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("loading a document does not mark it dirty", async () => {
      const w = mountWithEditor();
      // Tiptap emits "create" in a timeout after mounting
      await vi.advanceTimersByTimeAsync(0);
      await flushPromises();

      expect(editorOf(w).getHTML()).not.toBe(unnormalisedText);
      expect(w.get('[data-test="collab-save-status"]').text()).toContain(
        "All changes saved",
      );

      await vi.advanceTimersByTimeAsync(10_000);
      expect(commandRequest).not.toHaveBeenCalled();
      w.unmount();
    });

    it("typing back to the loaded text does not create a version", async () => {
      const w = mountWithEditor();
      await vi.advanceTimersByTimeAsync(0);
      await flushPromises();

      const editor = editorOf(w);
      editor.commands.insertContentAt(1, "x");
      await flushPromises();
      expect(w.get('[data-test="collab-save-status"]').text()).toContain(
        "Unsaved changes",
      );
      editor.commands.deleteRange({ from: 1, to: 2 });
      await flushPromises();

      await vi.advanceTimersByTimeAsync(10_000);
      expect(commandRequest).not.toHaveBeenCalled();
      w.unmount();
    });

    it("emits edits made right after mounting", async () => {
      const w = mountWithEditor();
      await flushPromises();

      // no 500 ms delay any more: the first edit is picked up immediately
      editorOf(w).commands.insertContentAt(1, "x");
      await flushPromises();

      expect(w.get('[data-test="collab-save-status"]').text()).toContain(
        "Unsaved changes",
      );
      await vi.advanceTimersByTimeAsync(5000);
      expect(commandRequest).toHaveBeenCalledTimes(1);
      expect(commandRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "<p>xHello <strong>World</strong></p>",
        }),
      );
      w.unmount();
    });
  });
});
