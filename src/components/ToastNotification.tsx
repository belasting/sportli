import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

export type ToastType = 'match' | 'like' | 'superlike';

interface ToastNotificationProps {
  visible: boolean;
  type: ToastType;
  userName: string;
  userPhoto: string;
  onPress?: () => void;
  onDismiss: () => void;
  autoDismissMs?: number;
}

const TOAST_CONFIG: Record<ToastType, { icon: string; label: string; color: string; bg: string }> = {
  match: {
    icon: 'heart',
    label: "It's a Match!",
    color: '#FF3B3B',
    bg: 'rgba(255,59,59,0.95)',
  },
  like: {
    icon: 'heart-outline',
    label: 'Liked your profile',
    color: '#4FC3F7',
    bg: 'rgba(2,136,209,0.95)',
  },
  superlike: {
    icon: 'star',
    label: 'Super Liked you!',
    color: '#FFB347',
    bg: 'rgba(255,140,0,0.95)',
  },
};

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  visible,
  type,
  userName,
  userPhoto,
  onPress,
  onDismiss,
  autoDismissMs = 3200,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = TOAST_CONFIG[type];
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 90,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      dismissTimer.current = setTimeout(() => {
        handleDismiss();
      }, autoDismissMs);
    }

    return () => {
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() => {
          if (dismissTimer.current) clearTimeout(dismissTimer.current);
          onPress?.();
          handleDismiss();
        }}
        style={[styles.toast, { backgroundColor: config.bg }]}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Image source={{ uri: userPhoto }} style={styles.avatar} />
          <View style={[styles.iconBadge, { backgroundColor: Colors.white }]}>
            <Ionicons name={config.icon as any} size={12} color={config.color} />
          </View>
        </View>

        {/* Text */}
        <View style={styles.textCol}>
          <Text style={styles.label}>{config.label}</Text>
          <Text style={styles.name} numberOfLines={1}>{userName}</Text>
        </View>

        {/* Dismiss */}
        <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={18} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    left: Spacing.base,
    right: Spacing.base,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    ...Shadow.lg,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textCol: { flex: 1 },
  label: { ...Typography.caption, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
  name: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
});
