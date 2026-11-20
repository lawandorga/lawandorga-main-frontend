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

const area = (
  id: number,
  title: string,
  placement: "showroom" | "more",
  screenshot: boolean,
) => ({
  id,
  title,
  description: `${title} description`,
  placement,
  position: id,
  icon_url: `/media/icons/${id}.png`,
  screenshot_url: screenshot ? `/media/shots/${id}.png` : null,
  screenshot_alt: screenshot ? `${title} alt` : "",
  screenshot_note: "",
});

const pageData: LoginPage = {
  content: "<p>old content</p>",
  feature_areas: [
    area(1, "Akten", "showroom", true),
    area(2, "Chat und Signal", "showroom", false),
    area(3, "Dashboard und News", "more", true),
    area(4, "E-Mail und externe Anfragen", "more", false),
  ],
  roadmap_items: [
    {
      id: 10,
      title: "Kalender mit Freigaben",
      description: "",
      date: "2026-09-11",
      status: "live",
      stage: "",
      benefits: [],
      status_note: "",
      icon_url: null,
      position: 0,
    },
    {
      id: 11,
      title: "L&O Forms",
      description: "Formulare für Ratsuchende.",
      date: "2026-11-20",
      status: "planned",
      stage: "Prototyp",
      benefits: ["Weniger Abtippen", "Keine unsicheren Dienste"],
      status_note: "Prototyp vorhanden.",
      icon_url: "/media/icons/forms.png",
      position: 0,
    },
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
    expect(document.title).toContain("Sichere Fallverwaltung");
    wrapper.unmount();
  });

  it("renders the showroom areas with the first one active", () => {
    const wrapper = mountPage();

    const buttons = wrapper.findAll("#einblick h3 button");
    expect(buttons.map((b) => b.text())).toEqual(["Akten", "Chat und Signal"]);
    expect(buttons[0].attributes("aria-current")).toBe("true");
    expect(buttons[1].attributes("aria-current")).toBeUndefined();

    const shot = wrapper.get("#showroom-panel img");
    expect(shot.attributes("src")).toBe("/media/shots/1.png");
    expect(shot.attributes("alt")).toBe("Akten alt");
    expect(wrapper.text()).toContain(
      "Screenshot aus der Demo-Organisation mit Beispieldaten.",
    );
    wrapper.unmount();
  });

  it("shows the icon and title for an area without screenshot", async () => {
    const wrapper = mountPage();

    await wrapper.findAll("#einblick h3 button")[1].trigger("click");

    const panel = wrapper.get("#showroom-panel");
    expect(panel.text()).toContain("Chat und Signal");
    expect(panel.find("img").attributes("alt")).toBe("");
    expect(
      wrapper.findAll("#einblick h3 button")[1].attributes("aria-current"),
    ).toBe("true");
    wrapper.unmount();
  });

  it("only makes 'more' rows with a screenshot expandable", () => {
    const wrapper = mountPage();

    const rows = wrapper.findAll("[data-testid='more-row']");
    expect(rows).toHaveLength(2);
    expect(rows[0].find("details").exists()).toBe(true);
    expect(
      rows[0].find("details img[alt='Dashboard und News alt']").exists(),
    ).toBe(true);
    expect(rows[1].find("details").exists()).toBe(false);
    expect(rows[1].text()).toContain("E-Mail und externe Anfragen");
    wrapper.unmount();
  });

  it("splits the roadmap into live items and planned accordion rows", () => {
    const wrapper = mountPage();

    expect(wrapper.get("[data-testid='roadmap-live']").text()).toContain(
      "Kalender mit Freigaben",
    );
    const planned = wrapper.findAll("details[data-testid='roadmap-planned']");
    expect(planned).toHaveLength(1);
    expect(planned[0].get("summary").text()).toContain("L&O Forms");
    expect(planned[0].get("summary").text()).toContain("Prototyp");
    expect(planned[0].findAll("li").map((li) => li.text())).toEqual([
      "Weniger Abtippen",
      "Keine unsicheren Dienste",
    ]);
    expect(planned[0].text()).toContain("Stand: Prototyp vorhanden.");
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
      "mailto:team@law-orga.de?subject=Law%26Orga%20f%C3%B6rdern%20(Website)",
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

  it("renders sponsor logos with the organization names", () => {
    const wrapper = mountPage();

    const alts = wrapper
      .findAll("#foerderer ~ ul img")
      .map((i) => i.attributes("alt"));
    expect(alts).toContain("CMS Stiftung");
    expect(alts).toHaveLength(6);
    wrapper.unmount();
  });

  it("renders against an older backend without the new fields", () => {
    page.value = {
      content: "",
      roadmap_items: [
        { id: 1, title: "Old item", description: "Old", date: "2024-01-01" },
      ],
      articles: [{ id: 2, title: "Old article", date: "2024-01-01" }],
    } as unknown as LoginPage;
    const wrapper = mountPage();

    expect(wrapper.find("#einblick h3 button").exists()).toBe(false);
    expect(wrapper.find("[data-testid='roadmap-planned']").exists()).toBe(
      false,
    );
    expect(wrapper.text()).toContain("Old article");
    wrapper.unmount();
  });

  it("renders without data", () => {
    page.value = null;
    const wrapper = mountPage();

    expect(wrapper.find("#einblick h3 button").exists()).toBe(false);
    expect(wrapper.find("[data-testid='news-lead']").exists()).toBe(false);
    expect(wrapper.text()).toContain("Datenschutz als Fundament");
    wrapper.unmount();
  });
});
