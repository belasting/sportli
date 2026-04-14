import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Sport } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface SportBadgeProps {
  sport: Sport;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export const SportBadge: React.FC<SportBadgeProps> = ({
  sport,
  size = 'md',
  variant = 'filled',
  style,
}) => {
  const sizeConfig = {
    sm: { iconSize: 12, fontSize: 10, px: Spacing.sm, py: 3 },
    md: { iconSize: 14, fontSize: 12, px: Spacing.md, py: Spacing.xs },
    lg: { iconSize: 18, fontSize: 14, px: Spacing.base, py: Spacing.sm },
  };

  const cfg = sizeConfig[size];

  const bgColor =
    variant === 'filled'
      ? Colors.primaryLight
      : variant === 'outline'
      ? 'transparent'
      : 'rgba(255,255,255,0.18)';

  const textColor =
    variant === 'filled'
      ? Colors.primaryDark
      : variant === 'ghost'
      ? Colors.white
      : Colors.primary;

  const borderColor =
    variant === 'outline' ? Colors.primary : 'transparent';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingHorizontal: cfg.px,
          paddingVertical: cfg.py,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons
        name={sport.icon as any}
        size={cfg.iconSize}
        color={textColor}
      />
      <Text style={[styles.text, { fontSize: cfg.fontSize, color: textColor }]}>
        {sport.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontWeight: '600',
  },
});
