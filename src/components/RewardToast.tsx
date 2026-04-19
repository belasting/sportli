import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography, Spacing, BorderRadius } from '../theme';

export type RewardType = 'streak' | 'daily_login' | 'first_match' | 'first_swipe';

interface RewardToastProps {
  visible: boolean;
  type: RewardType;
  streakCount?: number;
  onHide?: () => void;
}

interface RewardConfig {
  emoji: string;
  title: string;
  subtitle: string;
  gradient: [string, string];
}

function getConfig(type: RewardType, streakCount: number): RewardConfig {
  switch (type) {
    case 'streak':
      return {
        emoji: '🔥',
        title: `${streakCount} day streak!`,
        subtitle: "You're on fire, keep swiping",
        gradient: ['#FF6B35', '#FF3366'],
      };
    case 'daily_login':
      return {
        emoji: '👋',
        title: 'Welcome back!',
        subtitle: 'New profiles are waiting for you',
        gradient: ['#4FC3F7', '#0288D1'],
      };
    case 'first_match':
      return {
        emoji: '🎉',
        title: 'First match!',
        subtitle: "You're absolutely crushing it",
        gradient: ['#A855F7', '#EC4899'],
      };
    case 'first_swipe':
      return {
        emoji: '💪',
        title: "Let's go!",
        subtitle: 'Swipe to find your sport buddy',
        gradient: ['#10B981', '#0D9488'],
      };
  }
}

export const RewardToast: React.FC<RewardToastProps> = ({
  visible,
  type,
  streakCount = 1,
  onHide,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    if (!visible) return;

    translateY.setValue(-120);
    opacity.setValue(0);
    scale.setValue(0.88);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 7,
        tension: 72,
        useNativeDriver: true,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        friction: 7,
        tension: 72,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start(() => onHide?.());
    }, 3200);

    return () => clearTimeout(timer);
  }, [visible]);

  const config = getConfig(type, streakCount);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={config.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.emoji}>{config.emoji}</Text>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 32,
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 9999,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 14,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  emoji: {
    fontSize: 28,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Typography.labelLarge,
    color: '#fff',
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.88)',
  },
});
