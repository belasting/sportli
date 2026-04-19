import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const GradientButton: React.FC<Props> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {disabled ? (
          <View style={styles.disabled}>
            {loading ? (
              <ActivityIndicator color="rgba(255,255,255,0.4)" />
            ) : (
              <Text style={styles.labelDisabled}>{label}</Text>
            )}
          </View>
        ) : (
          <LinearGradient
            colors={['#FF6B35', '#FF3CAC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.label}>{label}</Text>
            )}
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3CAC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  disabled: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  labelDisabled: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.3,
  },
});
