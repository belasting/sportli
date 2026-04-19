import React, { useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';

interface Props extends React.ComponentProps<typeof TextInput> {
  label?: string;
  leftElement?: React.ReactNode;
  containerStyle?: ViewStyle;
  multiline?: boolean;
  inputHeight?: number;
}

export const RoundedInput: React.FC<Props> = ({
  label,
  leftElement,
  containerStyle,
  style,
  onFocus,
  onBlur,
  multiline = false,
  inputHeight,
  ...rest
}) => {
  const glow = useRef(new Animated.Value(0)).current;

  const handleFocus = (e: any) => {
    Animated.timing(glow, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    Animated.timing(glow, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    onBlur?.(e);
  };

  const borderColor = glow.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.15)', 'rgba(255,107,53,0.85)'],
  });

  const shadowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.35],
  });

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Animated.View
        style={[
          styles.container,
          multiline && styles.containerMulti,
          inputHeight ? { minHeight: inputHeight } : null,
          {
            borderColor,
            shadowOpacity,
            shadowColor: '#FF6B35',
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 10,
          },
        ]}
      >
        {leftElement ? <View style={styles.left}>{leftElement}</View> : null}
        <TextInput
          style={[styles.input, multiline && styles.inputMulti, style]}
          placeholderTextColor="rgba(255,255,255,0.35)"
          selectionColor="#FF6B35"
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  containerMulti: {
    alignItems: 'flex-start',
    paddingVertical: 14,
  },
  left: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    paddingVertical: 16,
  },
  inputMulti: {
    paddingVertical: 0,
    lineHeight: 22,
  },
});
