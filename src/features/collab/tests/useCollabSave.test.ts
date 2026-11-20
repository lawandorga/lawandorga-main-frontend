import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { effectScope, EffectScope, ref } from "vue";

import { AUTOSAVE_DELAY_MS, useCollabSave } from "../composables/useCollabSave";

const commandRequest = vi.fn();

vi.mock("@/composables/useCmd", () => ({
  default: () => ({ commandRequest }),
}));

interface Deferred {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: unknown) => void;
}

function deferred(): Deferred {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

let scope: EffectScope;

function setUp(initial = "<p>Hello</p>") {
  const model = ref(initial);
  const collabUuid = ref("collab-1");
  const save = scope.run(() => useCollabSave(model, collabUuid))!;
  return { model, ...save };
}

describe("useCollabSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    commandRequest.mockReset();
    commandRequest.mockResolvedValue({});
    scope = effectScope();
  });

  afterEach(() => {
    scope.stop();
    vi.useRealTimers();
  });

  it("starts as saved", () => {
    const { state, lastSavedAt } = setUp();
    expect(state.value).toBe("saved");
    expect(lastSavedAt.value).toBeNull();
  });

  it("marks typing as dirty and saves exactly once after the delay", async () => {
    const { model, state, lastSavedAt } = setUp();

    model.value = "<p>Hello W</p>";
    model.value = "<p>Hello World</p>";
    expect(state.value).toBe("dirty");

    await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY_MS - 1);
    expect(commandRequest).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(commandRequest).toHaveBeenCalledTimes(1);
    expect(commandRequest).toHaveBeenCalledWith({
      action: "collab/sync_collab",
      collab_uuid: "collab-1",
      text: "<p>Hello World</p>",
    });
    expect(state.value).toBe("saved");
    expect(lastSavedAt.value).toBeInstanceOf(Date);
  });

  it("shows saving while the request is in flight", async () => {
    const request = deferred();
    commandRequest.mockReturnValueOnce(request.promise);
    const { model, state, saveNow } = setUp();

    model.value = "<p>Changed</p>";
    const result = saveNow();
    expect(state.value).toBe("saving");

    request.resolve();
    await expect(result).resolves.toBe(true);
    expect(state.value).toBe("saved");
  });

  it("goes to error when the request fails, keeps the text and retries", async () => {
    commandRequest.mockRejectedValueOnce({ title: "Network Error" });
    const { model, state, saveNow, lastSavedAt } = setUp();

    model.value = "<p>Important</p>";
    await expect(saveNow()).resolves.toBe(false);
    expect(state.value).toBe("error");
    expect(model.value).toBe("<p>Important</p>");
    expect(lastSavedAt.value).toBeNull();

    await expect(saveNow()).resolves.toBe(true);
    expect(commandRequest).toHaveBeenCalledTimes(2);
    expect(commandRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({ text: "<p>Important</p>" }),
    );
    expect(state.value).toBe("saved");
  });

  it("schedules an autosave when typing in the error state", async () => {
    commandRequest.mockRejectedValueOnce({ title: "Network Error" });
    const { model, state, saveNow } = setUp();

    model.value = "<p>A</p>";
    await saveNow();
    expect(state.value).toBe("error");

    model.value = "<p>AB</p>";
    expect(state.value).toBe("dirty");
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY_MS);
    expect(commandRequest).toHaveBeenCalledTimes(2);
    expect(state.value).toBe("saved");
  });

  it("returns the same promise and sends no second request while one is in flight", async () => {
    const request = deferred();
    commandRequest.mockReturnValueOnce(request.promise);
    const { model, saveNow } = setUp();

    model.value = "<p>Changed</p>";
    const first = saveNow();
    const second = saveNow();

    expect(second).toBe(first);
    expect(commandRequest).toHaveBeenCalledTimes(1);

    request.resolve();
    await first;
  });

  it("sends no request when the text is unchanged", async () => {
    const { state, saveNow } = setUp();

    await expect(saveNow()).resolves.toBe(true);
    expect(commandRequest).not.toHaveBeenCalled();
    expect(state.value).toBe("saved");
  });

  it("returns to saved without a request when the text is typed back", async () => {
    const { model, state } = setUp("<p>A</p>");

    model.value = "<p>AB</p>";
    expect(state.value).toBe("dirty");
    model.value = "<p>A</p>";
    expect(state.value).toBe("saved");

    await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY_MS);
    expect(commandRequest).not.toHaveBeenCalled();
  });

  it("stays dirty and schedules a new autosave when the text changes during a request", async () => {
    const request = deferred();
    commandRequest.mockReturnValueOnce(request.promise);
    const { model, state, saveNow } = setUp();

    model.value = "<p>First</p>";
    const result = saveNow();
    model.value = "<p>First and second</p>";
    expect(state.value).toBe("saving");

    request.resolve();
    await result;
    expect(state.value).toBe("dirty");
    expect(commandRequest).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY_MS);
    expect(commandRequest).toHaveBeenCalledTimes(2);
    expect(commandRequest).toHaveBeenLastCalledWith(
      expect.objectContaining({ text: "<p>First and second</p>" }),
    );
    expect(state.value).toBe("saved");
  });

  it("flush saves a pending autosave immediately", async () => {
    const { model, flush } = setUp();

    model.value = "<p>Changed</p>";
    flush();
    expect(commandRequest).toHaveBeenCalledTimes(1);
  });

  it("saveNow cancels the pending autosave", async () => {
    const { model, saveNow } = setUp();

    model.value = "<p>Changed</p>";
    await saveNow();
    await vi.advanceTimersByTimeAsync(AUTOSAVE_DELAY_MS);
    expect(commandRequest).toHaveBeenCalledTimes(1);
  });
});
