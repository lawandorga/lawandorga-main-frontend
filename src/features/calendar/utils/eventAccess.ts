import type { EventSource } from "../constants";

type EventGrantTargets = {
  view_grant_targets?: string[];
  edit_grant_targets?: string[];
};

const ORG_TARGET_PREFIX = "org:";

export const getEventAccessKind = (event: EventGrantTargets): EventSource => {
  const targets = [
    ...(event.view_grant_targets ?? []),
    ...(event.edit_grant_targets ?? []),
  ];

  if (targets.some((target) => target.startsWith(ORG_TARGET_PREFIX))) {
    return "ORGANIZATION";
  }

  if (targets.length > 0) {
    return "SHARED";
  }

  return "PERSONAL";
};
