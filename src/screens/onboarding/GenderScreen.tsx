import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import { Gender } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Gender'>;
};

interface GenderOption {
  id: Gender;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const GENDERS: GenderOption[] = [
  { id: 'female', label: 'Female', icon: 'female-outline', description: 'She / Her' },
  { id: 'male', label: 'Male', icon: 'male-outline', description: 'He / Him' },
  { id: 'other', label: 'Other', icon: 'person-outline', description: 'They / Them' },
];

export const GenderScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [selected, setSelected] = useState<Gender | null>(data.gender);
  const scales = useRef(GENDERS.map(() => new Animated.Value(1))).current;

  const handleSelect = (id: Gender, index: number) => {
    setSelected(id);
    Animated.sequence([
      Animated.spring(scales[index], {
        toValue: 1.03,
        useNativeDriver: true,
        speed: 50,
        bounciness: 6,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 2,
      }),
    ]).start();
  };

  const handleContinue = () => {
    update({ gender: selected });
    navigation.navigate('Birthday');
  };

  return (
    <OnboardingLayout
      title="How do you identify?"
      subtitle="Used to personalize your experience"
      step={4}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={!selected}
    >
      <View style={styles.list}>
        {GENDERS.map((g, index) => {
          const isSelected = selected === g.id;
          return (
            <Animated.View
              key={g.id}
              style={{ transform: [{ scale: scales[index] }] }}
            >
              <TouchableOpacity
                onPress={() => handleSelect(g.id, index)}
                activeOpacity={0.85}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['rgba(255,107,53,0.20)', 'rgba(255,60,172,0.15)']}
                    style={[styles.card, styles.cardSelected]}
                  >
                    <CardInner option={g} isSelected />
                  </LinearGradient>
                ) : (
                  <View style={styles.card}>
                    <CardInner option={g} isSelected={false} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </OnboardingLayout>
  );
};

const CardInner: React.FC<{ option: GenderOption; isSelected: boolean }> = ({
  option,
  isSelected,
}) => (
  <>
    <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
      <Ionicons
        name={option.icon}
        size={28}
        color={isSelected ? '#FF6B35' : 'rgba(255,255,255,0.55)'}
      />
    </View>
    <View style={styles.cardText}>
      <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
        {option.label}
      </Text>
      <Text style={styles.cardDesc}>{option.description}</Text>
    </View>
    {isSelected ? (
      <View style={styles.checkWrap}>
        <LinearGradient
          colors={['#FF6B35', '#FF3CAC']}
          style={styles.check}
        >
          <Ionicons name="checkmark" size={14} color="#fff" />
        </LinearGradient>
      </View>
    ) : null}
  </>
);

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.11)',
    gap: 16,
  },
  cardSelected: {
    borderColor: 'rgba(255,107,53,0.55)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 10,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(255,107,53,0.15)',
  },
  cardText: { flex: 1 },
  cardLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
  },
  cardLabelSelected: { color: '#FFFFFF' },
  cardDesc: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  checkWrap: { marginLeft: 'auto' },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
