import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { ref } from "vue";

import StartPage from "@/views/StartPage.vue";

import type { LoginPage } from "../api/useLoginPage";

const page = ref<LoginPage | null>(null);

vi.mock("@/features/internal/api/useLoginPage", () => ({
  useLoginPage: () => ({ page }),
}));

const pageData: LoginPage = {
  content: "<p>old content</p>",
  roadmap_items: [
    { id: 10, title: "Old roadmap item", description: "", date: "2024-01-01" },
  ],
  articles: [
    {
      id: 21,
      title: "Lead article",
      preview: "Lead preview",
      date: "2026-10-08",
    },
    { id: 22, title: "Second", preview: "Second preview", date: "2026-09-17" },
    { id: 23, title: "Third", preview: "Third preview", date: "2026-08-27" },
  ],
};

const mountPage = () =>
  mount(StartPage, {
    attachTo: document.body,
    global: {
      plugins: [createTestingPinia()],
      stubs: {
        RouterLink: {
          props: ["to"],
          template: '<a :data-to="JSON.stringify(to)"><slot /></a>',
        },
      },
    },
  });

describe("StartPage", () => {
  beforeEach(() => {
    page.value = JSON.parse(JSON.stringify(pageData));
  });

  it("renders the landmarks, skip link and German page language", () => {
    const wrapper = mountPage();

    expect(wrapper.find("a.lo-skip").attributes("href")).toBe("#inhalt");
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.find("main#inhalt").exists()).toBe(true);
    expect(wrapper.find("footer").exists()).toBe(true);
    expect(wrapper.find("nav[aria-label='Hauptnavigation']").exists()).toBe(
      true,
    );
    expect(document.documentElement.lang).toBe("de");
    // sticky header: anchors and focus stay below it
    expect(wrapper.get("header").classes()).toContain("sticky");
    expect(document.documentElement.style.scrollPaddingTop).toBe("96px");
    expect(document.title).toContain("Sichere Fallverwaltung");
    wrapper.unmount();
  });

  it("renders the fixed showroom areas with the first one active", () => {
    const wrapper = mountPage();

    const buttons = wrapper.findAll("#einblick h3 button");
    expect(buttons.map((b) => b.text())).toEqual([
      "Akten",
      "Einzelne Akte",
      "Aufgaben",
      "Kalender",
      "Chat und Signal",
      "Statistik",
    ]);
    expect(buttons[0].attributes("aria-current")).toBe("true");
    expect(buttons[1].attributes("aria-current")).toBeUndefined();

    const shot = wrapper.get("#showroom-panel img");
    expect(shot.attributes("src")).toBe("/landing/screenshots/shot-akten.webp");
    expect(shot.attributes("alt")).toContain("Screenshot: Aktenliste");
    expect(wrapper.text()).toContain(
      "Screenshot aus der Demo-Organisation, Daten durch Beispieldaten ersetzt.",
    );
    wrapper.unmount();
  });
  it("shows the icon and title for an area without screenshot", async () => {
    const wrapper = mountPage();

    await wrapper.findAll("#einblick h3 button")[4].trigger("click");

    const panel = wrapper.get("#showroom-panel");
    expect(panel.text()).toContain("Chat und Signal");
    expect(panel.find("img").attributes("alt")).toBe("");
    expect(
      wrapper.findAll("#einblick h3 button")[4].attributes("aria-current"),
    ).toBe("true");
    wrapper.unmount();
  });

  it("only makes 'more' rows with a screenshot expandable", () => {
    const wrapper = mountPage();

    const rows = wrapper.findAll("[data-testid='more-row']");
    expect(rows.map((r) => r.find("summary, div").text())).toHaveLength(3);
    expect(rows[0].text()).toContain("Dashboard und News");
    expect(
      rows[0].find("details img[alt^='Screenshot: Dashboard']").exists(),
    ).toBe(true);
    expect(rows[1].find("details").exists()).toBe(false);
    expect(rows[1].text()).toContain("E-Mail und externe Anfragen");
    expect(rows[2].find("details").exists()).toBe(true);
    wrapper.unmount();
  });
  it("does not show the roadmap (parked) or roadmap items from the api", () => {
    const wrapper = mountPage();

    expect(wrapper.find("#roadmap").exists()).toBe(false);
    expect(wrapper.find("a[href='#roadmap']").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("Old roadmap item");
    wrapper.unmount();
  });
  it("shows the lead article and two more with dates", () => {
    const wrapper = mountPage();

    const lead = wrapper.get("[data-testid='news-lead']");
    expect(lead.text()).toContain("Lead article");
    expect(lead.text()).toContain("08.10.2026");
    expect(lead.text()).toContain("Lead preview");
    expect(lead.get("p").classes()).toContain("line-clamp-2");
    expect(wrapper.findAll("[data-testid='news-item']")).toHaveLength(2);
    wrapper.unmount();
  });

  it("keeps the title link and adds a 'Read full article' link per article", () => {
    const wrapper = mountPage();

    const articles = wrapper.findAll(
      "[data-testid='news-lead'], [data-testid='news-item']",
    );
    expect(articles).toHaveLength(3);
    for (const [i, article] of articles.entries()) {
      const id = pageData.articles[i].id;
      const target = JSON.stringify({
        name: "internal-article",
        params: { id },
      });
      expect(article.get("h3 a").attributes("data-to")).toBe(target);
      const readMore = article.get("[data-testid='read-more']");
      expect(readMore.attributes("data-to")).toBe(target);
      expect(readMore.text()).toContain("Read full article");
      // unique link name for screen readers
      expect(readMore.get(".sr-only").text()).toBe(
        `: ${pageData.articles[i].title}`,
      );
    }
    wrapper.unmount();
  });

  it("uses the exact mail subjects", () => {
    const wrapper = mountPage();

    const hrefs = wrapper
      .findAll("a[href^='mailto:']")
      .map((a) => a.attributes("href"));
    expect(hrefs).toContain(
      "mailto:team@law-orga.de?subject=Demo-Zugang%20anfragen%20(Website)",
    );
    expect(hrefs).toContain(
      "mailto:team@law-orga.de?subject=Law%26Orga%20f%C3%BCr%20unsere%20Organisation%20(Website)",
    );
    expect(hrefs).toContain(
      "mailto:team@law-orga.de?subject=Law%26Orga%20unterst%C3%BCtzen%20(Website)",
    );
    expect(hrefs).toContain("mailto:team@law-orga.de");
    expect(wrapper.text()).not.toContain("it@law-orga.de schreiben");
    wrapper.unmount();
  });

  it("does not render the old IndexPage content", () => {
    const wrapper = mountPage();

    expect(wrapper.text()).not.toContain("old content");
    wrapper.unmount();
  });

  it("links the voluntary contribution in the hero facts to 'Gemeinsam getragen'", () => {
    const wrapper = mountPage();

    const facts = wrapper
      .findAll("#top p")
      .find((p) => p.text().startsWith("Seit 2018"));
    // whitespace as the browser renders it
    expect(facts?.text().replace(/\s+/g, " ")).toContain(
      "Für Law Clinics dauerhaft kostenfrei und solidarisch mitgetragen: Wer kann, unterstützt mit einem freiwilligen Beitrag.",
    );
    const link = facts?.get("a");
    expect(link?.attributes("href")).toBe("#traeger");
    expect(link?.text()).toBe("freiwilligen Beitrag");
    expect(wrapper.find("section#traeger").exists()).toBe(true);
    wrapper.unmount();
  });

  it("links the LCD logo and name to the LCD website", () => {
    const wrapper = mountPage();

    const links = wrapper.findAll("[data-testid='lcd-link']");
    // header logo, logo in "Gemeinsam getragen", name in the footer
    expect(links).toHaveLength(3);
    for (const link of links) {
      expect(link.attributes("href")).toBe("https://law-clinics.de/");
      // accessible name: the link text or the alt text of the logo
      const img = link.find("img");
      const name = link.text() + (img.exists() ? img.attributes("alt") : "");
      expect(name).toContain("Law Clinics Deutschland e.V.");
    }
    wrapper.unmount();
  });

  it("renders sponsor logos with the organization names", () => {
    const wrapper = mountPage();

    const alts = wrapper
      .findAll("#foerderer ~ ul img")
      .map((i) => i.attributes("alt"));
    expect(alts).toContain("CMS Stiftung");
    expect(alts).toHaveLength(6);
    wrapper.unmount();
  });

  it("renders without data", () => {
    page.value = null;
    const wrapper = mountPage();

    // the showroom is fixed content, only the news wait for the api
    expect(wrapper.findAll("#einblick h3 button")).toHaveLength(6);
    expect(wrapper.find("[data-testid='news-lead']").exists()).toBe(false);
    expect(wrapper.text()).toContain("Datenschutz als Fundament");
    wrapper.unmount();
  });
});
