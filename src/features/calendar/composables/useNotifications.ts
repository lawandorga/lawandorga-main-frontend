import { computed, onMounted, onUnmounted, ref, watch } from "vue";

import useCmd from "@/composables/useCmd";
import useGet2 from "@/composables/useGet2";
import { useAlertStore } from "@/store/alert";

export interface CalendarNotification {
  uuid: string;
  message: string;
  event_uuid: string;
  read_at: string | null;
  created: string;
}

const POLL_INTERVAL_MS = 5000;

const sharedNotifications = ref<CalendarNotification[] | undefined>(undefined);

export function useNotifications() {
  const notifications = sharedNotifications;
  const query = useGet2("api/calendar/query/notifications/", notifications);
  const { commandRequest } = useCmd(query);

  const unreadCount = computed(
    () =>
      (notifications.value ?? []).filter(
        (notification) => notification.read_at === null,
      ).length,
  );

  const markAsRead = (uuid: string) =>
    commandRequest({
      action: "calendar/mark_notification_read",
      notification_uuid: uuid,
    }).catch(() => undefined); // the command error handler already alerts

  const markAllAsRead = () =>
    commandRequest({ action: "calendar/mark_all_notifications_read" }).catch(
      () => undefined,
    );

  const alertStore = useAlertStore();
  const seenUuids = new Set<string>();
  let hasInitializedSeenState = false;
  watch(notifications, (list) => {
    if (list === undefined) return;
    for (const notification of list) {
      const isNew = !seenUuids.has(notification.uuid);
      seenUuids.add(notification.uuid);
      if (!hasInitializedSeenState || !isNew || notification.read_at !== null)
        continue;
      alertStore.createAlert({
        type: "success",
        heading: "Reminder",
        message: notification.message,
      });
    }
    hasInitializedSeenState = true;
  });

  const titleWithoutCount = document.title.replace(/^\(\d+\)\s*/, "");
  watch(unreadCount, (count) => {
    document.title =
      count > 0 ? `(${count}) ${titleWithoutCount}` : titleWithoutCount;
  });

  const refetchWhenVisible = () => {
    if (document.visibilityState === "visible") query();
  };

  let pollTimer: ReturnType<typeof setInterval> | undefined;
  onMounted(() => {
    pollTimer = setInterval(query, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", refetchWhenVisible);
  });
  onUnmounted(() => {
    if (pollTimer !== undefined) clearInterval(pollTimer);
    document.removeEventListener("visibilitychange", refetchWhenVisible);
    document.title = titleWithoutCount;
  });

  return {
    notifications,
    unreadCount,
    markRead: markAsRead,
    markAllRead: markAllAsRead,
  };
}
