import React from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnimatedPress } from '../hooks/useAnimatedPress';
import { Colors } from '../theme';

interface ActionButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'like' | 'nope' | 'super' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

const SIZES = { sm: 48, md: 60, lg: 72 };

const VARIANT_BG: Record<string, string> = {
  like: 'transparent',  // gradient handles it
  nope: Colors.surfaceAlt,
  super: Colors.surfaceAlt,
  neutral: Colors.surfaceAlt,
};

const VARIANT_BORDER: Record<string, string> = {
  like: 'transparent',
  nope: Colors.accent,
  super: Colors.secondary,
  neutral: Colors.border,
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
  const isLike = variant === 'like';

  return (
    <TouchableWithoutFeedback onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.button,
          {
            width: dim,
            height: dim,
            borderRadius: dim / 2,
            backgroundColor: VARIANT_BG[variant],
            borderColor: VARIANT_BORDER[variant],
            transform: [{ scale: scaleAnim }],
            shadowColor: isLike ? Colors.primary : Colors.shadowDark,
            shadowOffset: { width: 0, height: isLike ? 6 : 3 },
            shadowOpacity: isLike ? 0.45 : 0.22,
            shadowRadius: isLike ? 16 : 8,
            elevation: isLike ? 10 : 4,
          },
          style,
        ]}
      >
        {isLike && (
          <LinearGradient
            colors={['#FF6B35', '#FF3366']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: dim / 2 }]}
          />
        )}
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
});
