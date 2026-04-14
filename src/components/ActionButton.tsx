import React from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useAnimatedPress } from '../hooks/useAnimatedPress';
import { Colors, BorderRadius, Shadow } from '../theme';

interface ActionButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'like' | 'nope' | 'super' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const VARIANT_COLORS = {
  like: Colors.primary,
  nope: Colors.accent,
  super: Colors.secondary,
  neutral: Colors.white,
};

const VARIANT_BORDER = {
  like: Colors.primary,
  nope: Colors.accent,
  super: Colors.secondary,
  neutral: Colors.border,
};

const SIZES = {
  sm: 48,
  md: 60,
  lg: 72,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  children,
  variant = 'neutral',
  size = 'md',
  style,
}) => {
  const { scaleAnim, onPressIn, onPressOut } = useAnimatedPress(0.88);
  const dim = SIZES[size];

  return (
    <TouchableWithoutFeedback onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.button,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: Colors.white,
            borderColor: VARIANT_BORDER[variant],
            transform: [{ scale: scaleAnim }],
          },
          Shadow.md,
          style,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
});
