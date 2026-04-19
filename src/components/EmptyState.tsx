import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

export type EmptyStateVariant = 'swipes' | 'matches' | 'messages' | 'groups' | 'search';

interface EmptyStateConfig {
  emoji: string;
  title: string;
  subtitle: string;
  cta?: string;
  secondaryCta?: string;
  gradient: [string, string];
}

const CONFIGS: Record<EmptyStateVariant, EmptyStateConfig> = {
  swipes: {
    emoji: '🔥',
    title: "You've seen everyone!",
    subtitle:
      "No one has liked you yet,\nstart swiping and increase your chances",
    cta: 'Start over',
    secondaryCta: 'Adjust filters',
    gradient: ['#FF6B35', '#FF3366'],
  },
  matches: {
    emoji: '💫',
    title: 'No matches yet',
    subtitle:
      "Keep swiping — your next match\nis just around the corner 🔥",
    cta: 'Start swiping',
    gradient: ['#4FC3F7', '#7B5EA7'],
  },
  messages: {
    emoji: '💬',
    title: 'No conversations yet',
    subtitle:
      'Match with someone to start chatting!\nYour next sport buddy is one swipe away',
    cta: 'Find sport buddies',
    gradient: ['#4FC3F7', '#0288D1'],
  },
  groups: {
    emoji: '🏆',
    title: 'No groups found',
    subtitle:
      'Join a crew and find people\nwho share your sport passion',
    cta: 'Browse all groups',
    secondaryCta: 'Create a group',
    gradient: ['#10B981', '#0D9488'],
  },
  search: {
    emoji: '🔍',
    title: 'No results found',
    subtitle: 'Try adjusting your search\nor explore different options',
    gradient: ['#8B8B9E', '#4A4A5E'],
  },
};

interface EmptyStateProps {
  variant: EmptyStateVariant;
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant,
  onAction,
  onSecondaryAction,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  const config = CONFIGS[variant];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    );
    loopRef.current.start();

    return () => loopRef.current?.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Animated.View style={[styles.emojiWrap, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={[`${config.gradient[0]}25`, `${config.gradient[1]}25`]}
          style={styles.emojiGradient}
        >
          <Text style={styles.emoji}>{config.emoji}</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.textBlock}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.subtitle}>{config.subtitle}</Text>
      </View>

      {config.cta && onAction && (
        <TouchableOpacity style={styles.ctaBtn} onPress={onAction} activeOpacity={0.85}>
          <LinearGradient
            colors={config.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>{config.cta}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {config.secondaryCta && onSecondaryAction && (
        <TouchableOpacity style={styles.secondaryBtn} onPress={onSecondaryAction}>
          <Text style={styles.secondaryText}>{config.secondaryCta}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing['2xl'],
  },
  emojiWrap: {
    marginBottom: Spacing.xs,
  },
  emojiGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 44,
  },
  textBlock: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 23,
  },
  ctaBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginTop: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 7,
  },
  ctaGradient: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    paddingVertical: Spacing.sm,
  },
  secondaryText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },
});
