import { debounce } from "lodash";
import { Ref, ref, watch } from "vue";

import useCmd from "@/composables/useCmd";

export type CollabSaveState = "saved" | "dirty" | "saving" | "error";

export const AUTOSAVE_DELAY_MS = 5000;

/**
 * Keeps the text of a collab in sync with the server.
 *
 * The state only becomes "saved" after the server confirmed the request.
 * Unchanged text is never sent, because every successful sync creates a new
 * version in the history of the collab.
 */
export function useCollabSave(model: Ref<string>, collabUuid: Ref<string>) {
  const { commandRequest } = useCmd();

  const state = ref<CollabSaveState>("saved");
  // the last text the server confirmed
  const lastSaved = ref<string>(model.value);
  const lastSavedAt = ref<Date | null>(null);

  let inflight: Promise<boolean> | null = null;

  const autosave = debounce(() => {
    void saveNow();
  }, AUTOSAVE_DELAY_MS);

  function saveNow(): Promise<boolean> {
    autosave.cancel();

    if (inflight) return inflight;

    if (model.value === lastSaved.value) {
      state.value = "saved";
      return Promise.resolve(true);
    }

    const snapshot = model.value;
    state.value = "saving";

    inflight = commandRequest({
      action: "collab/sync_collab",
      collab_uuid: collabUuid.value,
      text: snapshot,
    })
      .then(() => {
        lastSaved.value = snapshot;
        lastSavedAt.value = new Date();
        if (model.value === snapshot) {
          state.value = "saved";
        } else {
          state.value = "dirty";
          autosave();
        }
        return true;
      })
      .catch(() => {
        // the text stays in the editor, typing again schedules a retry
        state.value = "error";
        // edits made during the failed request were ignored by the watcher,
        // so retry them once without waiting for another keystroke
        if (model.value !== snapshot) autosave();
        return false;
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  }

  function scheduleAutosave() {
    autosave();
  }

  function flush() {
    autosave.flush();
  }

  /**
   * Replace the baseline without saving, e.g. with the HTML the editor
   * normalised the loaded text to. Ignored once the user changed the text.
   */
  function resetBaseline(text: string) {
    if (state.value !== "saved" || model.value !== lastSaved.value) return;
    lastSaved.value = text;
    model.value = text;
  }

  watch(
    model,
    (value) => {
      // handled when the request resolves
      if (state.value === "saving") return;

      if (value === lastSaved.value) {
        autosave.cancel();
        state.value = "saved";
      } else {
        state.value = "dirty";
        autosave();
      }
    },
    // keep state in sync with the model immediately, e.g. for route guards
    { flush: "sync" },
  );

  return {
    state,
    lastSavedAt,
    saveNow,
    scheduleAutosave,
    flush,
    resetBaseline,
  };
}
