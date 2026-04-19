import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { RoundedInput } from '../../components/onboarding/RoundedInput';
import { useOnboarding } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Phone'>;
};

export const PhoneScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [phone, setPhone] = useState(data.phone);

  const isValid = phone.replace(/\D/g, '').length >= 9;

  const handleContinue = () => {
    update({ phone });
    navigation.navigate('Verification', { phone: `+31 ${phone}` });
  };

  return (
    <OnboardingLayout
      title="Can we have your phone number?"
      subtitle="We'll send you a one-time verification code"
      step={1}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <RoundedInput
        leftElement={
          <TouchableOpacity style={styles.countryPicker} activeOpacity={0.7}>
            <Text style={styles.flag}>🇳🇱</Text>
            <Text style={styles.code}>+31</Text>
          </TouchableOpacity>
        }
        placeholder="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        maxLength={10}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={isValid ? handleContinue : undefined}
      />
      <Text style={styles.hint}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 12,
    marginRight: 4,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.15)',
  },
  flag: { fontSize: 20 },
  code: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hint: {
    marginTop: 20,
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 16,
  },
});
