import { describe, expect, it } from "vitest";
import { ref } from "vue";

import useUrl from "../useUrl";

describe("useUrl", () => {
  it("builds a static URL with no parameters", () => {
    const url = useUrl("/api/test/");
    expect(url.value).toBe("/api/test/");
  });

  it("replaces path parameters with string keys", () => {
    const folderId = ref("folder-123");
    const url = useUrl("/api/folders/{folderId}/", {
      pathParams: { folderId },
    });
    expect(url.value).toBe("/api/folders/folder-123/");
  });

  it("replaces path parameters with numeric string keys (0, 1, etc.)", () => {
    const folderUuid = ref("abc-def-ghi");
    const url = useUrl("/api/folders/query/{}/", {
      pathParams: { 0: folderUuid },
    });
    expect(url.value).toBe("/api/folders/query/abc-def-ghi/");
  });

  it("updates URL when reactive path parameter changes", () => {
    const folderId = ref("folder-1");
    const url = useUrl("/api/folders/{id}/", {
      pathParams: { id: folderId },
    });
    expect(url.value).toBe("/api/folders/folder-1/");

    folderId.value = "folder-2";
    expect(url.value).toBe("/api/folders/folder-2/");
  });

  it("builds query parameters from object", () => {
    const url = useUrl("/api/items/", {
      queryParams: { limit: 10, offset: 0 },
    });
    expect(url.value).toContain("/api/items/?");
    expect(url.value).toContain("limit=10");
    expect(url.value).toContain("offset=0");
  });

  it("updates query parameters when reactive object changes", () => {
    const params = ref({ page: 1, size: 10 });
    const url = useUrl("/api/items/", {
      queryParams: params,
    });
    expect(url.value).toContain("page=1");
    expect(url.value).toContain("size=10");

    params.value = { page: 2, size: 20 };
    expect(url.value).toContain("page=2");
    expect(url.value).toContain("size=20");
  });

  it("handles undefined and null query parameters correctly", () => {
    const url = useUrl("/api/items/", {
      queryParams: { filter: "active", optional: undefined, nullable: null },
    });
    expect(url.value).toContain("filter=active");
    // Undefined and null should not be in the URL
    expect(url.value).not.toContain("optional");
    expect(url.value).not.toContain("nullable");
  });

  it("combines path and query parameters", () => {
    const folderId = ref("folder-456");
    const queryParams = ref({ limit: 20, offset: 10 });
    const url = useUrl("/api/folders/{folderId}/items/", {
      pathParams: { folderId },
      queryParams,
    });
    expect(url.value).toContain("/api/folders/folder-456/items/?");
    expect(url.value).toContain("limit=20");
    expect(url.value).toContain("offset=10");
  });

  it("handles array values in query parameters", () => {
    const url = useUrl("/api/search/", {
      queryParams: { tags: ["urgent", "important"] },
    });
    // URLSearchParams joins arrays with commas
    expect(url.value).toContain("tags=urgent%2Cimportant");
  });

  it("handles boolean values in query parameters", () => {
    const url = useUrl("/api/items/", {
      queryParams: { active: true, archived: false },
    });
    expect(url.value).toContain("active=true");
    expect(url.value).toContain("archived=false");
  });

  it("replaces multiple path parameters", () => {
    const userId = ref("user-789");
    const folderId = ref("folder-789");
    const url = useUrl("/api/users/{userId}/folders/{folderId}/", {
      pathParams: { userId, folderId },
    });
    expect(url.value).toBe("/api/users/user-789/folders/folder-789/");
  });

  it("reactively updates when path parameter with numeric string key changes", () => {
    const uuid = ref("initial-uuid");
    const url = useUrl("/api/folders/query/{}/", {
      pathParams: { 0: uuid },
    });
    expect(url.value).toBe("/api/folders/query/initial-uuid/");

    uuid.value = "updated-uuid";
    expect(url.value).toBe("/api/folders/query/updated-uuid/");
  });
});
