import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

interface CompletionStep {
  label: string;
  tip: string;
  done: boolean;
}

function getSteps(user: User): CompletionStep[] {
  return [
    {
      label: 'Photo',
      tip: 'Add a profile photo',
      done: user.photos.length > 0,
    },
    {
      label: '3 photos',
      tip: 'Profiles with 3+ photos get 3x more matches!',
      done: user.photos.length >= 3,
    },
    {
      label: 'Bio',
      tip: 'Write a short bio to show your personality',
      done: (user.bio?.trim().length ?? 0) > 10,
    },
    {
      label: '2 sports',
      tip: 'Add 2 or more sports to find better matches',
      done: user.sports.length >= 2,
    },
    {
      label: 'Availability',
      tip: 'Set when you play so others can find you',
      done: user.availability.days.length > 0,
    },
  ];
}

interface ProfileCompletionBarProps {
  user: User;
  onEditPress?: () => void;
}

export const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({
  user,
  onEditPress,
}) => {
  const steps = useMemo(() => getSteps(user), [user]);
  const doneCount = steps.filter((s) => s.done).length;
  const percentage = Math.round((doneCount / steps.length) * 100);
  const nextTip = steps.find((s) => !s.done);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: percentage / 100,
        duration: 900,
        useNativeDriver: false,
      }),
    ]).start();
  }, [percentage]);

  if (percentage === 100) return null;

  const barColor =
    percentage < 40 ? Colors.error : percentage < 70 ? Colors.warning : Colors.success;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="person-circle-outline" size={18} color={barColor} />
          <Text style={styles.title}>Profile {percentage}% complete</Text>
        </View>
        <TouchableOpacity onPress={onEditPress}>
          <Text style={[styles.editLink, { color: Colors.primary }]}>Complete now</Text>
        </TouchableOpacity>
      </View>

      {/* Progress track */}
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <LinearGradient
            colors={[barColor, `${barColor}99`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>

      {/* Step dots */}
      <View style={styles.steps}>
        {steps.map((step, i) => (
          <View key={i} style={styles.stepItem}>
            <View
              style={[styles.dot, step.done ? { backgroundColor: barColor } : styles.dotEmpty]}
            />
            <Text
              style={[
                styles.stepLabel,
                step.done ? { color: Colors.textSecondary } : { color: Colors.textMuted },
              ]}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Tip row */}
      {nextTip && (
        <TouchableOpacity style={styles.tipRow} onPress={onEditPress} activeOpacity={0.7}>
          <Ionicons name="bulb-outline" size={14} color={Colors.warning} />
          <Text style={styles.tipText} numberOfLines={2}>
            {nextTip.tip}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  title: {
    ...Typography.labelLarge,
    color: Colors.textPrimary,
  },
  editLink: {
    ...Typography.label,
    fontWeight: '600',
  },
  track: {
    height: 7,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotEmpty: {
    backgroundColor: Colors.border,
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  tipText: {
    flex: 1,
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
