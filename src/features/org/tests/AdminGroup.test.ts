import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { nextTick, ref } from "vue";

import GroupsAddMember from "../actions/AddMemberToGroup.vue";
import AdminGroup from "../views/AdminGroup.vue";

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRoute: vi.fn(() => ({ params: { id: "1" } })),
  };
});

const activeMember = {
  id: 1,
  name: "Active Anna",
  email: "anna@example.org",
  last_login_month: "2026-05",
  activity_state: "green",
};
const inactiveMember = {
  id: 2,
  name: "Inactive Ivan",
  email: "ivan@example.org",
  last_login_month: "2024-01",
  activity_state: "red",
};

const group = ref<unknown>(null);
const members = ref<unknown[] | null>(null);
const permissions = ref<unknown[] | null>(null);

vi.mock("../api/useGroup", () => ({
  useGroup: () => ({ query: vi.fn(), members, group, permissions }),
}));

const mountComponent = () =>
  mount(AdminGroup, {
    global: {
      plugins: [createTestingPinia()],
      stubs: {
        RouterLink: { template: "<a><slot /></a>" },
        BreadcrumbsBar: true,
        GroupsAddMember: true,
        GroupsRemoveMember: true,
        GroupAddPermission: true,
        RemovePermission: true,
      },
    },
  });

describe("AdminGroup: activity filter", () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    group.value = {
      id: 1,
      name: "Beratung",
      description: "Active consultants",
    };
    members.value = [activeMember, inactiveMember];
    permissions.value = [];
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  it("lists all members before a filter is applied", () => {
    wrapper = mountComponent();

    expect(wrapper.text()).toContain("Active Anna");
    expect(wrapper.text()).toContain("Inactive Ivan");
  });

  it("shows only matching members after selecting an activity filter", async () => {
    wrapper = mountComponent();

    const activeButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Active (3 mo.)");
    await activeButton!.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Active Anna");
    expect(wrapper.text()).not.toContain("Inactive Ivan");
  });

  it("returns to the full list when the active filter is toggled off", async () => {
    wrapper = mountComponent();

    const activeButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Active (3 mo.)");
    await activeButton!.trigger("click");
    await activeButton!.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain("Active Anna");
    expect(wrapper.text()).toContain("Inactive Ivan");
  });

  it("explains when no member matches the active filter", async () => {
    wrapper = mountComponent();

    const noMatchButton = wrapper
      .findAll("button")
      .find((button) => button.text() === "Active (6 mo.)");
    await noMatchButton!.trigger("click");
    await nextTick();

    expect(wrapper.text()).toContain(
      "No members match the selected activity filter.",
    );
  });

  it("keeps the add-member action available for an empty group", () => {
    members.value = [];
    wrapper = mountComponent();

    expect(wrapper.text()).toContain("This group has no members yet.");
    expect(wrapper.text()).not.toContain(
      "No members match the selected activity filter.",
    );
    expect(wrapper.findComponent(GroupsAddMember).exists()).toBe(true);
  });
});
