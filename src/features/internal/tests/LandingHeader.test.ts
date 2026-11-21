import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { nextTick } from "vue";

import LandingHeader from "../components/landing/LandingHeader.vue";

let reportVisible: (id: string) => void = () => {};

vi.stubGlobal(
  "IntersectionObserver",
  class {
    constructor(callback: IntersectionObserverCallback) {
      reportVisible = (id) =>
        callback(
          [
            {
              isIntersecting: true,
              target: { id },
            } as IntersectionObserverEntry,
          ],
          this as unknown as IntersectionObserver,
        );
    }
    observe() {}
    disconnect() {}
  },
);

const mountHeader = (isAuthenticated = false) =>
  mount(LandingHeader, {
    attachTo: document.body,
    props: { loginUrl: "/login/", isAuthenticated },
    global: {
      stubs: {
        RouterLink: {
          props: ["to"],
          template: '<a :data-to="JSON.stringify(to)"><slot /></a>',
        },
        NavigationDropdown: { template: '<div data-testid="profile-menu" />' },
      },
    },
  });

describe("LandingHeader", () => {
  it("links the sections, records upload, register and the sign in", () => {
    const wrapper = mountHeader();

    const hrefs = wrapper
      .findAll("[data-testid='section-links'] a")
      .map((a) => a.attributes("href"));
    expect(hrefs).toEqual([
      "#einblick",
      "#sicherheit",
      "#organisationen",
      "#neuigkeiten",
    ]);
    const accountLinks = wrapper.findAll("[data-testid='account-links'] a");
    expect(accountLinks.map((a) => a.text())).toEqual([
      "Records Upload",
      "Register",
    ]);
    expect(accountLinks[0].attributes("data-to")).toBe(
      JSON.stringify({ name: "records-upload" }),
    );
    expect(wrapper.get("#mobile-menu").text()).toContain("Records Upload");
    expect(wrapper.text()).toContain("Sign in");
    expect(wrapper.find("[data-testid='profile-menu']").exists()).toBe(false);
    wrapper.unmount();
  });

  it("shows the dashboard link and the profile menu when signed in", () => {
    const wrapper = mountHeader(true);

    expect(wrapper.text()).toContain("Dashboard");
    expect(wrapper.text()).not.toContain("Sign in");
    expect(wrapper.text()).not.toContain("Register");
    expect(wrapper.find("[data-testid='profile-menu']").exists()).toBe(true);
    wrapper.unmount();
  });

  it("highlights the visible section", async () => {
    const wrapper = mountHeader();

    reportVisible("sicherheit");
    await nextTick();

    const current = wrapper.findAll("[aria-current='location']");
    expect(current.map((a) => a.text())).toEqual(["Sicherheit", "Sicherheit"]);

    reportVisible("traeger");
    await nextTick();
    expect(wrapper.find("[aria-current='location']").exists()).toBe(false);
    wrapper.unmount();
  });

  it("opens the mobile menu and closes it on link click and Escape", async () => {
    const wrapper = mountHeader();
    const button = wrapper.get("button[aria-controls='mobile-menu']");

    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
    await wrapper.get("#mobile-menu a").trigger("click");
    expect(button.attributes("aria-expanded")).toBe("false");

    await button.trigger("click");
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await nextTick();
    expect(button.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button.element);
    wrapper.unmount();
  });
});
