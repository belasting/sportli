import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingProvider } from '../context/OnboardingContext';
import { OnboardingStackParamList } from '../types';
import { PhoneScreen } from '../screens/onboarding/PhoneScreen';
import { VerificationScreen } from '../screens/onboarding/VerificationScreen';
import { NameScreen } from '../screens/onboarding/NameScreen';
import { GenderScreen } from '../screens/onboarding/GenderScreen';
import { BirthdayScreen } from '../screens/onboarding/BirthdayScreen';
import { SportsScreen } from '../screens/onboarding/SportsScreen';
import { PhotosScreen } from '../screens/onboarding/PhotosScreen';
import { CityScreen } from '../screens/onboarding/CityScreen';
import { DescriptionScreen } from '../screens/onboarding/DescriptionScreen';
import { PreferenceScreen } from '../screens/onboarding/PreferenceScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <OnboardingProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Phone" component={PhoneScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Birthday" component={BirthdayScreen} />
        <Stack.Screen name="Sports" component={SportsScreen} />
        <Stack.Screen name="Photos" component={PhotosScreen} />
        <Stack.Screen name="City" component={CityScreen} />
        <Stack.Screen name="Description" component={DescriptionScreen} />
        <Stack.Screen name="Preference" component={PreferenceScreen} />
      </Stack.Navigator>
    </OnboardingProvider>
  );
};
