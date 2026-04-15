import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius, Shadow } from '../theme';

export interface PromoConfig {
  id: string;
  icon: 'crown' | 'lightning-bolt' | 'heart' | 'people';
  title: string;
  subtitle: string;
  cta?: string;
  gradient: readonly [string, string];
}

export const PROMO_MESSAGES: PromoConfig[] = [
  {
    id: 'boost',
    icon: 'lightning-bolt',
    title: 'Boost your profile',
    subtitle: 'Get 10x more matches with Sportli+',
    cta: 'Try free',
    gradient: [Colors.secondary, '#FF5722'],
  },
  {
    id: 'swipe_more',
    icon: 'heart',
    title: 'Keep swiping!',
    subtitle: 'You\'re close to your next match 🎯',
    gradient: [Colors.primary, Colors.primaryDark],
  },
  {
    id: 'premium',
    icon: 'crown',
    title: 'Sportli+ unlocked',
    subtitle: 'See who liked you & unlimited swipes',
    cta: 'Upgrade',
    gradient: ['#9C27B0', '#673AB7'],
  },
  {
    id: 'groups',
    icon: 'people',
    title: 'Join a group!',
    subtitle: 'Find players near you in group chats',
    cta: 'Explore',
    gradient: ['#00BCD4', Colors.primaryDark],
  },
];

interface PromoNotificationProps {
  config: PromoConfig;
  onDismiss: () => void;
  onCta?: () => void;
}

export const PromoNotification: React.FC<PromoNotificationProps> = ({
  config,
  onDismiss,
  onCta,
}) => {
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 80,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
        tension: 80,
      }),
    ]).start();

    // Auto dismiss after 3.5s
    const timer = setTimeout(() => dismiss(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(onDismiss);
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={config.gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        {/* Icon */}
        {config.icon === 'crown' || config.icon === 'lightning-bolt' ? (
          <MaterialCommunityIcons name={config.icon} size={22} color="#fff" />
        ) : (
          <Ionicons name={config.icon} size={22} color="#fff" />
        )}

        {/* Text */}
        <Animated.View style={styles.textWrap}>
          <Text style={styles.title} numberOfLines={1}>{config.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{config.subtitle}</Text>
        </Animated.View>

        {/* CTA */}
        {config.cta && (
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => { dismiss(); onCta?.(); }}
          >
            <Text style={styles.ctaText}>{config.cta}</Text>
          </TouchableOpacity>
        )}

        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={dismiss} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="close" size={16} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 42,
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 1000,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    ...Shadow.lg,
  },
  textWrap: { flex: 1 },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 11,
    marginTop: 1,
  },
  ctaBtn: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
