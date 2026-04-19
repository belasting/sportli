// Push notifications via expo-notifications
// Install: npx expo install expo-notifications
// iOS: add NSUserNotificationsUsageDescription to app.json infoPlist
// Android: notifications are enabled by default

import { Platform } from 'react-native';

// Lazy-load to avoid crash if expo-notifications is not installed
// Install: npx expo install expo-notifications
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let N: any = null;
try {
  N = require('expo-notifications');
} catch {
  // expo-notifications not installed — notification features are disabled
}

export type NotificationType = 'like' | 'match' | 'message' | 'comeback' | 'boost';

const MESSAGES: Record<NotificationType, { title: string; body: string }> = {
  like: {
    title: 'Someone liked you 👀',
    body: "Go check out who it is before they find someone else!",
  },
  match: {
    title: 'You got a match 🔥',
    body: "It's a match! Don't keep them waiting...",
  },
  message: {
    title: 'New message waiting 💬',
    body: 'You have an unread message from your match',
  },
  comeback: {
    title: "It's been a while... 😏",
    body: 'Your next match is waiting — come back and keep swiping!',
  },
  boost: {
    title: 'Boost your profile now 🚀',
    body: 'Get seen by 10x more people in the next 30 minutes',
  },
};

// Aim for 6 PM – 10 PM local time for comeback triggers
function getSmartDelay(baseMs: number): number {
  const now = new Date();
  const h = now.getHours();

  if (h >= 18 && h < 22) return baseMs;

  const target = new Date(now);
  if (h >= 22) target.setDate(target.getDate() + 1);
  target.setHours(19, 0, 0, 0);

  return Math.max(baseMs, target.getTime() - now.getTime());
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!N || Platform.OS === 'web') return false;

  const { status: existing } = await N.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await N.requestPermissionsAsync();
  return status === 'granted';
}

export function setupNotificationHandler(): void {
  if (!N) return;

  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export async function scheduleNotification(
  type: NotificationType,
  delaySeconds = 0
): Promise<string | null> {
  if (!N) return null;

  const ok = await requestNotificationPermissions();
  if (!ok) return null;

  const msg = MESSAGES[type];
  const smartDelayMs = getSmartDelay(delaySeconds * 1000);
  const smartSeconds = Math.floor(smartDelayMs / 1000);

  try {
    return await N.scheduleNotificationAsync({
      content: {
        title: msg.title,
        body: msg.body,
        data: { type },
        sound: true,
      },
      trigger: smartSeconds > 0 ? { seconds: smartSeconds } : null,
    });
  } catch {
    return null;
  }
}

export async function scheduleComebackNotification(): Promise<string | null> {
  // 20 hours — smart scheduling will push it to evening if needed
  return scheduleNotification('comeback', 20 * 3600);
}

export async function scheduleBoostReminder(): Promise<string | null> {
  return scheduleNotification('boost', 48 * 3600);
}

export async function cancelAllScheduled(): Promise<void> {
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
}
