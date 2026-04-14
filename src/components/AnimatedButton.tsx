import React from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, BorderRadius, Spacing } from '../theme';
import { useAnimatedPress } from '../hooks/useAnimatedPress';

interface AnimatedButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { scaleAnim, onPressIn, onPressOut } = useAnimatedPress();

  const sizeStyles = {
    sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.base, minHeight: 40 },
    md: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, minHeight: 52 },
    lg: { paddingVertical: Spacing.base, paddingHorizontal: Spacing['2xl'], minHeight: 60 },
  };

  const textSizes = {
    sm: Typography.label,
    md: Typography.labelLarge,
    lg: { ...Typography.labelLarge, fontSize: 17 },
  };

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const containerStyle: ViewStyle = {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    opacity: disabled ? 0.5 : 1,
    ...(isOutline && {
      borderWidth: 2,
      borderColor: Colors.primary,
      borderRadius: BorderRadius.xl,
    }),
    ...style,
  };

  const innerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...sizeStyles[size],
    ...(isOutline && { backgroundColor: 'transparent' }),
    ...(isGhost && { backgroundColor: 'transparent' }),
    ...(isSecondary && { backgroundColor: Colors.secondary }),
    ...(isDanger && { backgroundColor: Colors.accent }),
  };

  const labelColor = isOutline
    ? Colors.primary
    : isGhost
    ? Colors.textSecondary
    : Colors.white;

  const content = (
    <View style={innerStyle}>
      {loading ? (
        <ActivityIndicator color={labelColor} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[textSizes[size], { color: labelColor, fontWeight: '600' }, textStyle]}>
            {label}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <TouchableWithoutFeedback
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[containerStyle, { transform: [{ scale: scaleAnim }] }]}>
        {isPrimary ? (
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={innerStyle}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                {icon}
                <Text style={[textSizes[size], { color: Colors.white, fontWeight: '600' }, textStyle]}>
                  {label}
                </Text>
              </>
            )}
          </LinearGradient>
        ) : (
          content
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
