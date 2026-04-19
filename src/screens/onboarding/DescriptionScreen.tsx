import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { RoundedInput } from '../../components/onboarding/RoundedInput';
import { useOnboarding } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Description'>;
};

const MAX_CHARS = 280;

const PLACEHOLDER =
  "Tell others about yourself...\n\n• Your sport level and goals\n• What you're looking for in a buddy\n• How often you train";

export const DescriptionScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [description, setDescription] = useState(data.description);

  const remaining = MAX_CHARS - description.length;
  const isOverLimit = remaining < 0;

  const handleContinue = () => {
    update({ description });
    navigation.navigate('Preference');
  };

  return (
    <OnboardingLayout
      title="About you"
      subtitle="Let others know what kind of sport buddy you are"
      step={9}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueLabel={description.trim().length === 0 ? 'Skip' : 'Continue'}
      continueDisabled={isOverLimit}
      scrollable
    >
      <RoundedInput
        placeholder={PLACEHOLDER}
        value={description}
        onChangeText={t => {
          if (t.length <= MAX_CHARS + 10) setDescription(t);
        }}
        multiline
        inputHeight={160}
        autoFocus={false}
        returnKeyType="default"
      />
      <View style={styles.counter}>
        <Text style={[styles.count, isOverLimit && styles.countOver]}>
          {remaining}
        </Text>
      </View>

      {/* Prompt suggestions */}
      <View style={styles.promptsSection}>
        <Text style={styles.promptsLabel}>Quick prompts</Text>
        <View style={styles.promptsList}>
          {PROMPTS.map(p => (
            <PromptChip
              key={p}
              label={p}
              onPress={() =>
                setDescription(prev =>
                  prev.length > 0 ? `${prev}\n${p} ` : `${p} `
                )
              }
            />
          ))}
        </View>
      </View>
    </OnboardingLayout>
  );
};

const PROMPTS = [
  'I train 3x a week',
  'Looking for a weekly running buddy',
  'Intermediate level',
  'Open to all skill levels',
  'Morning workouts only',
];

const PromptChip: React.FC<{ label: string; onPress: () => void }> = ({
  label,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.chip} activeOpacity={0.7}>
    <Text style={styles.chipText}>+ {label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  counter: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  count: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.30)',
    fontWeight: '500',
  },
  countOver: { color: '#FF3CAC' },
  promptsSection: { marginTop: 24 },
  promptsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.40)',
    marginBottom: 10,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  promptsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  chipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
});
