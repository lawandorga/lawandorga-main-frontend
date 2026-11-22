import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import { vi } from "vitest";
import { defineComponent, h } from "vue";

import CollabForm from "../components/CollabForm.vue";

const commandRequest = vi.fn();
vi.mock("@/composables/useCmd", () => ({
  default: () => ({ commandRequest }),
}));

type Route = { query: { selectedId?: string } };
let leaveGuard: () => Promise<boolean>;
// eslint-disable-next-line no-unused-vars
let updateGuard: (to: Route) => true | Promise<boolean>;
vi.mock("vue-router", async () => ({
  ...(await vi.importActual("vue-router")),
  onBeforeRouteLeave: (guard: typeof leaveGuard) => (leaveGuard = guard),
  onBeforeRouteUpdate: (guard: typeof updateGuard) => (updateGuard = guard),
}));

const FormTipTapTwo = defineComponent({
  props: ["modelValue"],
  emits: ["update:modelValue"],
  setup:
    (_, { slots }) =>
    () =>
      h("div", slots.default?.()),
});

const mountForm = () =>
  mount(CollabForm, {
    props: { text: "<p>Hello</p>", collabUuid: "collab-1" },
    global: { stubs: { FormTipTapTwo } },
  });

const type = (wrapper: VueWrapper, text: string) =>
  wrapper.findComponent(FormTipTapTwo).vm.$emit("update:modelValue", text);

const status = (wrapper: VueWrapper) =>
  wrapper.get('[data-test="collab-status"]').text();

describe("CollabForm", () => {
  beforeEach(() => {
    commandRequest.mockReset();
    commandRequest.mockResolvedValue({});
  });

  it("shows saved only after the server confirmed", async () => {
    let confirmSave!: () => void;
    commandRequest.mockReturnValue(new Promise<void>((r) => (confirmSave = r)));
    const wrapper = mountForm();
    await type(wrapper, "<p>Hello World</p>");

    await wrapper.trigger("keydown", { key: "s", ctrlKey: true });
    expect(status(wrapper)).toBe("Saving...");

    confirmSave();
    await flushPromises();
    expect(status(wrapper)).toBe("Saved");
    expect(commandRequest).toHaveBeenCalledWith({
      action: "collab/sync_collab",
      collab_uuid: "collab-1",
      text: "<p>Hello World</p>",
    });
  });

  it("shows not saved when saving fails", async () => {
    commandRequest.mockRejectedValue({});
    const wrapper = mountForm();
    await type(wrapper, "<p>Hello World</p>");

    await wrapper.get('[data-test="collab-save"] button').trigger("click");
    await flushPromises();
    expect(status(wrapper)).toBe("Not saved");
  });

  it("saves before leaving", async () => {
    const wrapper = mountForm();
    await type(wrapper, "<p>Hello World</p>");

    expect(await leaveGuard()).toBe(true);
    expect(commandRequest).toHaveBeenCalledTimes(1);
  });

  it("asks before leaving when saving fails", async () => {
    commandRequest.mockRejectedValue({});
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    const wrapper = mountForm();
    await type(wrapper, "<p>Hello World</p>");

    expect(await updateGuard({ query: { selectedId: "collab-2" } })).toBe(
      false,
    );
    expect(confirm).toHaveBeenCalled();
  });

  it("does not save when the route stays on this collab", async () => {
    const wrapper = mountForm();
    await type(wrapper, "<p>Hello World</p>");

    expect(updateGuard({ query: { selectedId: "collab-1" } })).toBe(true);
    expect(commandRequest).not.toHaveBeenCalled();
  });

  it("saves pending changes when unmounted", async () => {
    const wrapper = mountForm();
    await type(wrapper, "<p>Hello World</p>");

    wrapper.unmount();
    expect(commandRequest).toHaveBeenCalledTimes(1);
  });
});
