import { useState, useEffect, useCallback } from 'react';
import {
  cancelAllScheduled,
  scheduleComebackNotification,
} from '../services/notifications';

// Install: npx expo install @react-native-async-storage/async-storage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  // Package not installed — retention state runs in-memory only
}

const KEYS = {
  LAST_LOGIN: 'sportli_last_login',
  STREAK: 'sportli_streak',
  FIRST_MATCH: 'sportli_first_match',
} as const;

function toDateStr(d = new Date()): string {
  return d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateStr(d);
}

export interface RetentionState {
  streak: number;
  isFirstToday: boolean;
  showFirstMatchReward: boolean;
  markFirstMatch: () => Promise<void>;
}

export function useRetention(): RetentionState {
  const [streak, setStreak] = useState(0);
  const [isFirstToday, setIsFirstToday] = useState(false);
  const [showFirstMatchReward, setShowFirstMatchReward] = useState(false);

  useEffect(() => {
    (async () => {
      const today = toDateStr();
      const yesterday = yesterdayStr();

      if (!AsyncStorage) {
        // No persistence — treat every session as a new day
        setStreak(1);
        setIsFirstToday(true);
        return;
      }

      const [lastLogin, storedStreak] = await Promise.all([
        AsyncStorage.getItem(KEYS.LAST_LOGIN),
        AsyncStorage.getItem(KEYS.STREAK),
      ]);

      const prevStreak = storedStreak ? parseInt(storedStreak, 10) : 0;

      if (lastLogin === today) {
        setStreak(prevStreak);
        setIsFirstToday(false);
        return;
      }

      const newStreak = lastLogin === yesterday ? prevStreak + 1 : 1;

      await Promise.all([
        AsyncStorage.setItem(KEYS.LAST_LOGIN, today),
        AsyncStorage.setItem(KEYS.STREAK, String(newStreak)),
      ]);

      setStreak(newStreak);
      setIsFirstToday(true);

      await cancelAllScheduled();
      await scheduleComebackNotification();
    })();
  }, []);

  const markFirstMatch = useCallback(async () => {
    if (!AsyncStorage) {
      setShowFirstMatchReward(true);
      setTimeout(() => setShowFirstMatchReward(false), 4500);
      return;
    }

    const done = await AsyncStorage.getItem(KEYS.FIRST_MATCH);
    if (done) return;

    await AsyncStorage.setItem(KEYS.FIRST_MATCH, '1');
    setShowFirstMatchReward(true);
    setTimeout(() => setShowFirstMatchReward(false), 4500);
  }, []);

  return { streak, isFirstToday, showFirstMatchReward, markFirstMatch };
}
