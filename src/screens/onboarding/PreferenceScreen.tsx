import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import { Preference } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Preference'>;
};

interface Option {
  id: Preference;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const OPTIONS: Option[] = [
  {
    id: 'mixed',
    label: 'Everyone',
    icon: 'people-outline',
    description: "Show me all sport buddies",
  },
  {
    id: 'men',
    label: 'Men',
    icon: 'male-outline',
    description: 'Show me male sport buddies',
  },
  {
    id: 'women',
    label: 'Women',
    icon: 'female-outline',
    description: 'Show me female sport buddies',
  },
];

export const PreferenceScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [selected, setSelected] = useState<Preference | null>(data.preference);
  const scales = useRef(OPTIONS.map(() => new Animated.Value(1))).current;

  const handleSelect = (id: Preference, index: number) => {
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
    update({ preference: selected });
    // Navigate to main app
    navigation.getParent()?.navigate('Main' as never);
  };

  return (
    <OnboardingLayout
      title="Who are you looking for?"
      subtitle="You can always change this later in settings"
      step={10}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueLabel="Let's go!"
      continueDisabled={!selected}
    >
      <View style={styles.list}>
        {OPTIONS.map((option, index) => {
          const isSelected = selected === option.id;

          return (
            <Animated.View
              key={option.id}
              style={{ transform: [{ scale: scales[index] }] }}
            >
              <TouchableOpacity
                onPress={() => handleSelect(option.id, index)}
                activeOpacity={0.85}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#FF6B35', '#FF3CAC']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.option, styles.optionSelected]}
                  >
                    <OptionInner option={option} isSelected />
                  </LinearGradient>
                ) : (
                  <View style={styles.option}>
                    <OptionInner option={option} isSelected={false} />
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

const OptionInner: React.FC<{ option: Option; isSelected: boolean }> = ({
  option,
  isSelected,
}) => (
  <>
    <Ionicons
      name={option.icon}
      size={28}
      color={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.55)'}
    />
    <View style={styles.optionText}>
      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
        {option.label}
      </Text>
      <Text style={[styles.optionDesc, isSelected && styles.optionDescSelected]}>
        {option.description}
      </Text>
    </View>
    {isSelected ? (
      <View style={styles.checkCircle}>
        <Ionicons name="checkmark" size={16} color="#FF6B35" />
      </View>
    ) : null}
  </>
);

const styles = StyleSheet.create({
  list: { gap: 12 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  optionSelected: {
    borderColor: 'transparent',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.40,
    shadowRadius: 18,
    elevation: 12,
  },
  optionText: { flex: 1 },
  optionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.70)',
  },
  optionLabelSelected: { color: '#FFFFFF' },
  optionDesc: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  optionDescSelected: { color: 'rgba(255,255,255,0.75)' },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
