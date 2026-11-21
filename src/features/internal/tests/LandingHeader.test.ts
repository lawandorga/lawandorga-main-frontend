import { mount } from "@vue/test-utils";

import LandingHeader from "../components/landing/LandingHeader.vue";

const mountHeader = (props = {}) =>
  mount(LandingHeader, {
    props: { loginUrl: "https://auth.example/login/", ...props },
    attachTo: document.body,
    global: {
      stubs: { RouterLink: { template: "<a><slot /></a>" } },
    },
  });

describe("LandingHeader: mobile menu", () => {
  it("toggles aria-expanded and keeps a constant accessible name", async () => {
    const wrapper = mountHeader();
    const button = wrapper.get('button[aria-controls="mobile-menu"]');

    expect(button.attributes("aria-expanded")).toBe("false");
    expect(button.text()).toBe("Menü");
    expect(wrapper.get("#mobile-menu").isVisible()).toBe(false);

    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("true");
    expect(button.text()).toBe("Menü");
    expect(wrapper.get("#mobile-menu").isVisible()).toBe(true);

    await button.trigger("click");
    expect(button.attributes("aria-expanded")).toBe("false");
    wrapper.unmount();
  });

  it("closes the menu when a link is clicked", async () => {
    const wrapper = mountHeader();
    const button = wrapper.get('button[aria-controls="mobile-menu"]');
    await button.trigger("click");

    await wrapper.get('#mobile-menu a[href="#neuigkeiten"]').trigger("click");

    expect(button.attributes("aria-expanded")).toBe("false");
    wrapper.unmount();
  });

  it("closes the menu on Escape and returns the focus to the button", async () => {
    const wrapper = mountHeader();
    const button = wrapper.get('button[aria-controls="mobile-menu"]');
    await button.trigger("click");

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await wrapper.vm.$nextTick();

    expect(button.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(button.element);
    wrapper.unmount();
  });

  it("prefixes the anchor links on other pages", () => {
    const wrapper = mountHeader({ anchorBase: "/start/" });

    const hrefs = wrapper
      .findAll("#mobile-menu a")
      .map((a) => a.attributes("href"));

    expect(hrefs).toContain("/start/#einblick");
    expect(hrefs).toContain("/start/#neuigkeiten");
    wrapper.unmount();
  });

  it("highlights the current section in both navigations", () => {
    const wrapper = mountHeader({
      anchorBase: "/start/",
      currentSection: "neuigkeiten",
    });

    const current = wrapper.findAll('a[aria-current="location"]');
    expect(current).toHaveLength(2); // desktop navigation and mobile menu
    for (const link of current) {
      expect(link.text()).toBe("Neuigkeiten");
      expect(link.attributes("href")).toBe("/start/#neuigkeiten");
    }
    wrapper.unmount();
  });

  it("highlights nothing without a current section", () => {
    const wrapper = mountHeader();

    expect(wrapper.findAll('a[aria-current="location"]')).toHaveLength(0);
    wrapper.unmount();
  });

  it("shows Sign in for visitors and Dashboard for signed in users", () => {
    const visitor = mountHeader();
    expect(visitor.text()).toContain("Sign in");
    visitor.unmount();

    const member = mountHeader({ isAuthenticated: true });
    expect(member.text()).toContain("Dashboard");
    expect(member.text()).not.toContain("Sign in");
    member.unmount();
  });
});
