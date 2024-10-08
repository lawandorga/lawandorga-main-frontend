import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import { nextTick } from "vue";
import FolderMailImportsVue from "../views/FolderMailImports.vue";

vi.mock("vue-router");

describe("FolderMailImports", () => {
  const wrapper = mount(FolderMailImportsVue, {
    global: {
      plugins: [createTestingPinia()],
    },
    props: {
      query: vi.fn,
      folderUuid: "123",
      selectedType: "MAIL_IMPORTS",
      mails: [
        {
          uuid: "12341234123412341234123412341234",
          sender: "hello@gmail.com",
          to: "other.address@gmail.com",
          cc: "",
          subject: "First email",
          content: "Content of the first email, some yada yada yada",
          sending_datetime: new Date(2022, 5, 21),
          is_read: true,
          is_pinned: false,
          mail_attachments: [],
        },
        {
          uuid: "23452345234523452345234523452345",
          sender: "hello@gmail.com",
          to: "other.address@gmail.com",
          cc: "",
          subject: "Second email",
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          sending_datetime: new Date(2021, 1, 10),
          is_read: true,
          is_pinned: true,
          mail_attachments: [],
        },
        {
          uuid: "34563456345634563456345634563456",
          sender: "hello@gmail.com",
          to: "other.address@gmail.com",
          cc: "",
          subject: "Third email",
          content:
            "Dear sir or madam, this is the third email. Kind regards, someone",
          sending_datetime: new Date(2023, 11, 1),
          is_read: false,
          is_pinned: false,
          mail_attachments: [],
        },
      ],
    },
  });

  it("should display emails in correct order", () => {
    const subjects = wrapper.findAll(".text-ellipsis");
    expect(subjects).toHaveLength(3);
    expect(subjects[0].text()).toBe("Second email");
    expect(subjects[1].text()).toBe("First email");
    expect(subjects[2].text()).toBe("Third email");
  });

  describe("SearchBar", () => {
    it("should display", () => {
      expect(wrapper.find("input[type=search]").exists()).toBeTruthy();
    });

    it("should filter emails correctly", async () => {
      const searchBar = wrapper.find("input[type=search]");
      searchBar.setValue("email");
      await nextTick();
      expect(wrapper.findAll(".text-ellipsis")).toHaveLength(3);

      searchBar.setValue("First");
      await nextTick();
      expect(wrapper.findAll(".text-ellipsis")).toHaveLength(1);

      searchBar.setValue("first");
      await nextTick();
      expect(wrapper.findAll(".text-ellipsis")).toHaveLength(1);

      searchBar.setValue("This should not be found");
      await nextTick();
      expect(wrapper.findAll(".text-ellipsis")).toHaveLength(0);

      searchBar.setValue("");
      await nextTick();
      expect(wrapper.findAll(".text-ellipsis")).toHaveLength(3);
    });
  });
});
