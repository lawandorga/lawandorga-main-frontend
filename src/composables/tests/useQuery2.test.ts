import { createTestingPinia } from "@pinia/testing";
import { mount } from "@vue/test-utils";
import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import useQuery2 from "../useQuery2";

const request = vi.fn();

vi.mock("@/api/client", () => ({
  default: () => ({ get2: () => request, get: () => vi.fn() }),
}));

vi.mock("@/utils/login", () => ({
  getLoginUrl: () => "https://auth.test/login/?next=calendar",
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

interface Payload {
  ok: boolean;
}

const setUpQuery = () => {
  const target = ref<Payload>();
  let query!: () => Promise<void>;

  mount(
    {
      setup() {
        query = useQuery2("/api/test/", target);
        return () => null;
      },
    },
    { global: { plugins: [createTestingPinia({ createSpy: vi.fn })] } },
  );

  return { query, target };
};

const responseError = (status: number) => {
  const error = new AxiosError("request failed");
  error.response = {
    status,
    statusText: "",
    data: {},
    headers: {},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: {} as any,
  };
  return error;
};

describe("useQuery2", () => {
  beforeEach(() => {
    request.mockReset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });
  });

  it("writes the response into the given ref", async () => {
    request.mockResolvedValue({ ok: true });

    const { query, target } = setUpQuery();
    await query();

    expect(target.value).toEqual({ ok: true });
  });

  it("redirects to the login page when the user is not authenticated", async () => {
    request.mockRejectedValue(responseError(401));

    const { query } = setUpQuery();
    await expect(query()).rejects.toMatchObject({
      title: "Authentication Error",
    });

    expect(window.location.href).toBe("https://auth.test/login/?next=calendar");
  });

  it("rejects with a usable error instead of crashing on other failures", async () => {
    request.mockRejectedValue(responseError(500));

    const { query } = setUpQuery();
    await expect(query()).rejects.not.toBeInstanceOf(TypeError);
  });
});
