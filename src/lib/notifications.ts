export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function scheduleReminder(reminderTime: string) {
  if (!isNotificationSupported() || Notification.permission !== "granted") return;

  const [hours, minutes] = reminderTime.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) target.setDate(target.getDate() + 1);

  const delayMs = target.getTime() - now.getTime();

  navigator.serviceWorker.ready.then((reg) => {
    reg.active?.postMessage({
      type: "SCHEDULE_REMINDER",
      delayMs,
      title: "Time to practice! 🔥",
      body: "Your daily German practice is waiting. Keep your streak alive!",
    });
  });
}
