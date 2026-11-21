import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { vi } from "vitest";
import { ref } from "vue";

import type { ArticleList } from "../api/useLoginPage";
import InternalArticles from "../views/InternalArticles.vue";

// the list uses the articles of the existing landing page endpoint
const page = ref<{ articles: ArticleList[] } | null>(null);
const setArticles = (articles: ArticleList[]) => {
  page.value = { articles };
};

vi.mock("@/features/internal/api/useLoginPage", () => ({
  useLoginPage: () => ({ page }),
}));

const mountPage = () =>
  mount(InternalArticles, {
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

describe("InternalArticles", () => {
  it("lists the articles in two columns with preview and read more link", () => {
    setArticles([
      { id: 1, title: "First", preview: "First preview", date: "2026-10-08" },
      { id: 2, title: "Second", preview: "", date: "2026-09-17" },
    ]);
    const wrapper = mountPage();

    expect(wrapper.get("[data-testid='article-grid']").classes()).toContain(
      "md:grid-cols-2",
    );
    const items = wrapper.findAll("article");
    expect(items).toHaveLength(2);

    expect(items[0].text()).toContain("08.10.2026");
    expect(items[0].get("h2 a").text()).toBe("First");
    expect(items[0].get("p").classes()).toContain("line-clamp-2");
    expect(items[0].get("[data-testid='read-more']").text()).toContain(
      "Read full article",
    );

    // no empty preview paragraph
    expect(items[1].find("p").exists()).toBe(false);
    expect(items[1].find("[data-testid='read-more']").exists()).toBe(true);
    wrapper.unmount();
  });

  it("says so when there are no articles", () => {
    setArticles([]);
    const wrapper = mountPage();

    expect(wrapper.text()).toContain("Zurzeit gibt es keine Neuigkeiten.");
    wrapper.unmount();
  });
});
