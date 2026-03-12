import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import { nextTick, ref } from "vue";
import FolderDataSheet from "../components/FolderDataSheet.vue";
import type { Sheet } from "../api/useDataSheet";

type RouteWithSelectedId = { query: { selectedId?: string } };
type LeaveGuard = () => Promise<undefined | false>;
type UpdateGuard = (
  to: RouteWithSelectedId,
  from: RouteWithSelectedId,
) => Promise<undefined | false>;

// Capture the navigation guard callbacks so we can trigger them manually in tests
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
    useRoute: vi.fn(() => ({
      query: { selectedId: "record-1" },
      params: { uuid: "folder-1" },
    })),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      currentRoute: { value: { query: {} } },
    })),
  };
});

const mockRecord = ref<Sheet | null>(null);
vi.mock("../api/useDataSheet", () => ({
  useDataSheet: () => ({ record: mockRecord, recordsQuery: vi.fn() }),
}));

const clientNameField = {
  id: 1,
  uuid: "field-1",
  kind: "Standard",
  label: "Name",
  name: "Maria Musterfrau",
  is_required: true,
  type: "text",
};

const baseSheet: Sheet = {
  id: 1,
  uuid: "record-1",
  folder_uuid: "folder-1",
  name: "Test Record",
  created: "2024-01-01",
  updated: "2024-01-01",
  template_name: "Test Template",
  fields: [],
  entries: {},
};

const mountComponent = () =>
  mount(FolderDataSheet, {
    props: {
      folderContent: [],
      selectedId: "record-1",
      selectedType: "RECORD",
      query: vi.fn(),
    },
    global: {
      plugins: [createTestingPinia()],
      stubs: {
        FormDataSheet: true,
        BoxHeadingStats: true,
        DataSheetChangeName: true,
        DeleteDataSheet: true,
      },
    },
  });

describe("FolderDataSheet: required fields warning", () => {
  let wrapper: ReturnType<typeof mountComponent>;

  beforeEach(() => {
    capturedLeaveGuard = null;
    capturedUpdateGuard = null;
    mockRecord.value = null;
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  describe("when leaving the page", () => {
    it("shows the warning modal with the empty field name", async () => {
      mockRecord.value = {
        ...baseSheet,
        fields: [clientNameField],
        entries: {},
      };
      wrapper = mountComponent();

      capturedLeaveGuard!();
      await nextTick();

      expect(document.body.textContent).toContain("Required fields missing");
      expect(document.body.textContent).toContain("Maria Musterfrau");
    });

    it("does not show the warning when all required fields are filled", async () => {
      mockRecord.value = {
        ...baseSheet,
        fields: [clientNameField],
        entries: { "field-1": "Alice" },
      };
      wrapper = mountComponent();

      capturedLeaveGuard!();
      await nextTick();

      expect(document.body.textContent).not.toContain(
        "Required fields missing",
      );
    });

    it("does not show the warning when no fields are required", async () => {
      mockRecord.value = {
        ...baseSheet,
        fields: [{ ...clientNameField, is_required: false }],
        entries: {},
      };
      wrapper = mountComponent();

      capturedLeaveGuard!();
      await nextTick();

      expect(document.body.textContent).not.toContain(
        "Required fields missing",
      );
    });
  });

  describe("when switching to a different record", () => {
    it("shows the warning modal when the current record has empty required fields", async () => {
      mockRecord.value = {
        ...baseSheet,
        fields: [clientNameField],
        entries: {},
      };
      wrapper = mountComponent();

      capturedUpdateGuard!(
        { query: { selectedId: "record-2" } },
        { query: { selectedId: "record-1" } },
      );
      await nextTick();

      expect(document.body.textContent).toContain("Required fields missing");
    });

    it("does not show the warning when switching away from a non-record view", async () => {
      mockRecord.value = {
        ...baseSheet,
        fields: [clientNameField],
        entries: {},
      };
      wrapper = mountComponent();

      capturedUpdateGuard!(
        { query: { selectedId: "record-2" } },
        { query: { selectedId: undefined } },
      );
      await nextTick();

      expect(document.body.textContent).not.toContain(
        "Required fields missing",
      );
    });
  });
});
