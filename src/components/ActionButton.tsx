import React from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimatedPress } from '../hooks/useAnimatedPress';
import { Colors, BorderRadius, Shadow } from '../theme';

interface ActionButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'like' | 'nope' | 'super' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const SIZES = { sm: 50, md: 62, lg: 76 };

// Gradient colors for each variant (gives a premium feel)
const GRADIENTS: Record<string, [string, string]> = {
  like: ['#4FC3F7', '#0288D1'],
  nope: ['#FF6B6B', '#FF3B3B'],
  super: ['#FFB347', '#FF8C00'],
  neutral: ['#FFFFFF', '#F8F9FA'],
};

const ICON_COLORS: Record<string, string> = {
  like: Colors.white,
  nope: Colors.white,
  super: Colors.white,
  neutral: Colors.textSecondary,
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  onPress,
  children,
  variant = 'neutral',
  size = 'md',
  style,
}) => {
  const { scaleAnim, onPressIn, onPressOut } = useAnimatedPress(0.86);
  const dim = SIZES[size];
  const gradient = GRADIENTS[variant];
  const isNeutral = variant === 'neutral';

  // Clone icon child with correct color
  const tintedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        color: ICON_COLORS[variant],
      })
    : children;

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.wrapper,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            transform: [{ scale: scaleAnim }],
          },
          isNeutral ? styles.neutralShadow : styles.coloredShadow,
          style,
        ]}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius: dim / 2 }]}
        >
          {isNeutral ? children : tintedChild}
        </LinearGradient>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutralShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coloredShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.20,
    shadowRadius: 14,
    elevation: 8,
  },
});
