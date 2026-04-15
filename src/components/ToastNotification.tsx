import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

interface ToastProps {
  message: string;
  type: 'like' | 'nope' | 'match';
}

const TOAST_CONFIG = {
  like: { color: Colors.primary, icon: 'heart' as const },
  nope: { color: Colors.accent, icon: 'close-circle' as const },
  match: { color: '#FFD700', icon: 'star' as const },
};

export const ToastNotification: React.FC<ToastProps> = ({ message, type }) => {
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const config = TOAST_CONFIG[type];

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1400),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -80,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
      ]}
      pointerEvents="none"
    >
      <Ionicons name={config.icon} size={18} color={config.color} />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 90,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    ...Shadow.md,
    zIndex: 999,
  },
  text: {
    ...Typography.label,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
