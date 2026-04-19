import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import { SPORTS } from '../../data/sports';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Sports'>;
};

const MAX = 3;

export const SportsScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.sports);
  const scales = useRef(SPORTS.map(() => new Animated.Value(1))).current;

  const toggle = useCallback(
    (id: string, index: number) => {
      setSelected(prev => {
        if (prev.includes(id)) return prev.filter(s => s !== id);
        if (prev.length >= MAX) return prev;
        return [...prev, id];
      });

      Animated.sequence([
        Animated.spring(scales[index], {
          toValue: 1.06,
          useNativeDriver: true,
          speed: 60,
          bounciness: 8,
        }),
        Animated.spring(scales[index], {
          toValue: 1,
          useNativeDriver: true,
          speed: 40,
          bounciness: 2,
        }),
      ]).start();
    },
    [scales]
  );

  const handleContinue = () => {
    update({ sports: selected });
    navigation.navigate('Photos');
  };

  return (
    <OnboardingLayout
      title="Pick your sports"
      subtitle={`Choose up to ${MAX} sports you love`}
      step={6}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
      continueDisabled={selected.length === 0}
      scrollable
    >
      {/* Counter */}
      <View style={styles.counterRow}>
        <View style={styles.counter}>
          <LinearGradient
            colors={['#FF6B35', '#FF3CAC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.counterBadge}
          >
            <Text style={styles.counterText}>{selected.length}/{MAX}</Text>
          </LinearGradient>
          <Text style={styles.counterLabel}>selected</Text>
        </View>
      </View>

      {/* Grid */}
      <View style={styles.grid}>
        {SPORTS.map((sport, index) => {
          const isSelected = selected.includes(sport.id);
          const isDisabled = !isSelected && selected.length >= MAX;

          return (
            <Animated.View
              key={sport.id}
              style={[styles.cardWrap, { transform: [{ scale: scales[index] }] }]}
            >
              <TouchableOpacity
                onPress={() => toggle(sport.id, index)}
                activeOpacity={0.8}
                disabled={isDisabled}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['rgba(255,107,53,0.25)', 'rgba(255,60,172,0.18)']}
                    style={[styles.card, styles.cardSelected]}
                  >
                    <SportCardContent sport={sport} isSelected isDisabled={false} />
                  </LinearGradient>
                ) : (
                  <View style={[styles.card, isDisabled && styles.cardDisabled]}>
                    <SportCardContent
                      sport={sport}
                      isSelected={false}
                      isDisabled={isDisabled}
                    />
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

interface SportCardContentProps {
  sport: (typeof SPORTS)[number];
  isSelected: boolean;
  isDisabled: boolean;
}

const SportCardContent: React.FC<SportCardContentProps> = ({
  sport,
  isSelected,
  isDisabled,
}) => (
  <View style={styles.cardInner}>
    <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
      <MaterialCommunityIcons
        name={sport.icon as any}
        size={26}
        color={
          isSelected
            ? '#FF6B35'
            : isDisabled
            ? 'rgba(255,255,255,0.2)'
            : 'rgba(255,255,255,0.6)'
        }
      />
    </View>
    <Text
      style={[
        styles.sportName,
        isSelected && styles.sportNameSelected,
        isDisabled && styles.sportNameDisabled,
      ]}
      numberOfLines={1}
    >
      {sport.name}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  counterRow: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  counterLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cardWrap: {
    width: '47.5%',
  },
  card: {
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: 16,
  },
  cardSelected: {
    borderColor: 'rgba(255,107,53,0.55)',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  cardDisabled: {
    opacity: 0.45,
  },
  cardInner: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
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
  sportName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  sportNameSelected: { color: '#FFFFFF' },
  sportNameDisabled: { color: 'rgba(255,255,255,0.20)' },
});
