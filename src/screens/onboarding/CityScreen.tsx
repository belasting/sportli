import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { RoundedInput } from '../../components/onboarding/RoundedInput';
import { useOnboarding } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'City'>;
};

const POPULAR = ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven'];

export const CityScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [city, setCity] = useState(data.city);

  const isValid = city.trim().length >= 2;

  const handleContinue = () => {
    update({ city: city.trim() });
    navigation.navigate('Description');
  };

  return (
    <OnboardingLayout
      title="Where are you based?"
      subtitle="Find sport buddies near you"
      step={8}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <RoundedInput
        leftElement={
          <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.45)" />
        }
        placeholder="Your city"
        value={city}
        onChangeText={setCity}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={isValid ? handleContinue : undefined}
      />

      {/* Location button */}
      <TouchableOpacity style={styles.locationBtn} activeOpacity={0.75}>
        <LinearGradient
          colors={['rgba(255,107,53,0.18)', 'rgba(255,60,172,0.10)']}
          style={styles.locationGradient}
        >
          <Ionicons name="navigate-outline" size={18} color="#FF6B35" />
          <Text style={styles.locationText}>Use my current location</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Popular cities */}
      <View style={styles.popularSection}>
        <Text style={styles.popularLabel}>Popular cities</Text>
        <View style={styles.popularList}>
          {POPULAR.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setCity(c)}
              style={[styles.chip, city === c && styles.chipSelected]}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, city === c && styles.chipTextSelected]}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  locationBtn: {
    marginTop: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  locationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,107,53,0.25)',
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
  },
  popularSection: { marginTop: 28 },
  popularLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.40)',
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  popularList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipSelected: {
    backgroundColor: 'rgba(255,107,53,0.18)',
    borderColor: 'rgba(255,107,53,0.50)',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  chipTextSelected: {
    color: '#FF6B35',
    fontWeight: '700',
  },
});
