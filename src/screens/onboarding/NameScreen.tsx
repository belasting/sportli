import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { RoundedInput } from '../../components/onboarding/RoundedInput';
import { useOnboarding } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Name'>;
};

export const NameScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [name, setName] = useState(data.name);

  const isValid = name.trim().length >= 2;

  const handleContinue = () => {
    update({ name: name.trim() });
    navigation.navigate('Gender');
  };

  return (
    <OnboardingLayout
      title="What's your name?"
      subtitle="This is how others will see you"
      step={3}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <RoundedInput
        placeholder="First name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={isValid ? handleContinue : undefined}
      />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({});
