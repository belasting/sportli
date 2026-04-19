import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Verification'>;
  route: RouteProp<OnboardingStackParamList, 'Verification'>;
};

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export const VerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { phone } = route.params;
  const [value, setValue] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);
  const boxScales = useRef(
    Array.from({ length: CODE_LENGTH }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const animateBox = useCallback(
    (index: number) => {
      Animated.sequence([
        Animated.spring(boxScales[index], {
          toValue: 1.14,
          useNativeDriver: true,
          speed: 60,
          bounciness: 6,
        }),
        Animated.spring(boxScales[index], {
          toValue: 1,
          useNativeDriver: true,
          speed: 30,
          bounciness: 2,
        }),
      ]).start();
    },
    [boxScales]
  );

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, CODE_LENGTH);
    const prevLen = value.length;
    setValue(digits);

    if (digits.length > prevLen) {
      animateBox(digits.length - 1);
    }
  };

  const handleResend = () => {
    setCountdown(RESEND_SECONDS);
  };

  const isComplete = value.length === CODE_LENGTH;

  return (
    <OnboardingLayout
      title="Enter the code"
      subtitle={`Sent to ${phone}`}
      step={2}
      onBack={() => navigation.goBack()}
      onContinue={() => navigation.navigate('Name')}
      continueDisabled={!isComplete}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={styles.boxRow}
      >
        {Array.from({ length: CODE_LENGTH }).map((_, i) => {
          const char = value[i] ?? '';
          const isFilled = char !== '';
          const isActive = i === value.length;

          return (
            <Animated.View
              key={i}
              style={[
                styles.boxWrap,
                { transform: [{ scale: boxScales[i] }] },
              ]}
            >
              {isFilled ? (
                <LinearGradient
                  colors={['rgba(255,107,53,0.25)', 'rgba(255,60,172,0.25)']}
                  style={[styles.box, styles.boxFilled]}
                >
                  <Text style={styles.digit}>{char}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.box, isActive && styles.boxActive]}>
                  {isActive ? <View style={styles.cursor} /> : null}
                </View>
              )}
            </Animated.View>
          );
        })}
      </TouchableOpacity>

      {/* Hidden TextInput captures all input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={CODE_LENGTH}
        style={styles.hiddenInput}
        caretHidden
      />

      <View style={styles.resendWrap}>
        {countdown > 0 ? (
          <Text style={styles.resendTimer}>
            Resend code in{' '}
            <Text style={styles.resendCount}>{countdown}s</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendActive}>Resend code</Text>
          </TouchableOpacity>
        )}
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  boxRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  boxWrap: {
    flex: 1,
  },
  box: {
    height: 58,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: 'rgba(255,107,53,0.55)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  boxActive: {
    borderColor: 'rgba(255,107,53,0.85)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  digit: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cursor: {
    width: 2,
    height: 22,
    backgroundColor: '#FF6B35',
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
    top: -100,
  },
  resendWrap: {
    marginTop: 32,
    alignItems: 'center',
  },
  resendTimer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.40)',
  },
  resendCount: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
  resendActive: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '700',
  },
});
