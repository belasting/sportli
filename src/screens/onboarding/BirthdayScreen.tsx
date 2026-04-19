import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types';
import { OnboardingLayout } from '../../components/onboarding/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Birthday'>;
};

const ITEM_H = 52;
const VISIBLE = 5;
const PICKER_H = ITEM_H * VISIBLE;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const now = new Date();
const MIN_AGE = 16;
const MAX_AGE = 80;

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const YEARS = Array.from(
  { length: MAX_AGE - MIN_AGE + 1 },
  (_, i) => String(now.getFullYear() - MIN_AGE - i)
);

interface WheelColumnProps {
  data: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  flex?: number;
}

const WheelColumn: React.FC<WheelColumnProps> = ({
  data,
  selectedIndex,
  onSelect,
  flex = 1,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  const scrollToIndex = useCallback(
    (index: number, animated = false) => {
      scrollRef.current?.scrollTo({ y: index * ITEM_H, animated });
    },
    []
  );

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const raw = e.nativeEvent.contentOffset.y / ITEM_H;
    const index = Math.max(0, Math.min(data.length - 1, Math.round(raw)));
    onSelect(index);
    scrollToIndex(index, true);
  };

  return (
    <View style={[styles.column, { flex }]}>
      {/* Center highlight */}
      <View style={styles.highlight} pointerEvents="none" />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        onLayout={() => scrollToIndex(selectedIndex, false)}
        scrollEventThrottle={16}
      >
        {data.map((item, i) => {
          const isSelected = i === selectedIndex;
          return (
            <View key={i} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  isSelected && styles.itemTextSelected,
                ]}
              >
                {item}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Top fade */}
      <LinearGradient
        colors={['#0D0D1A', 'transparent']}
        style={[styles.fade, styles.fadeTop]}
        pointerEvents="none"
      />
      {/* Bottom fade */}
      <LinearGradient
        colors={['transparent', '#0D0D1A']}
        style={[styles.fade, styles.fadeBottom]}
        pointerEvents="none"
      />
    </View>
  );
};

export const BirthdayScreen: React.FC<Props> = ({ navigation }) => {
  const { data, update } = useOnboarding();

  const initial = data.birthday ?? new Date(now.getFullYear() - 22, 0, 1);
  const [dayIdx, setDayIdx] = useState(initial.getDate() - 1);
  const [monthIdx, setMonthIdx] = useState(initial.getMonth());
  const [yearIdx, setYearIdx] = useState(
    YEARS.findIndex(y => y === String(initial.getFullYear())) ?? 6
  );

  const selectedDate = new Date(
    Number(YEARS[yearIdx]),
    monthIdx,
    Number(DAYS[dayIdx])
  );

  const handleContinue = () => {
    update({ birthday: selectedDate });
    navigation.navigate('Sports');
  };

  const formatted = selectedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <OnboardingLayout
      title="When's your birthday?"
      subtitle="You must be at least 16 years old"
      step={5}
      onBack={() => navigation.goBack()}
      onContinue={handleContinue}
    >
      {/* Selected date display */}
      <View style={styles.dateDisplay}>
        <Text style={styles.dateText}>{formatted}</Text>
      </View>

      {/* Wheel picker */}
      <View style={styles.pickerContainer}>
        <WheelColumn data={DAYS} selectedIndex={dayIdx} onSelect={setDayIdx} flex={1} />
        <WheelColumn data={MONTHS} selectedIndex={monthIdx} onSelect={setMonthIdx} flex={2} />
        <WheelColumn data={YEARS} selectedIndex={yearIdx} onSelect={setYearIdx} flex={1} />
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  dateDisplay: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 8,
  },
  column: {
    height: PICKER_H,
    overflow: 'hidden',
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    top: ITEM_H * 2,
    left: 4,
    right: 4,
    height: ITEM_H,
    backgroundColor: 'rgba(255,107,53,0.14)',
    borderRadius: 10,
    zIndex: 1,
  },
  item: {
    height: ITEM_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.30)',
  },
  itemTextSelected: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: ITEM_H * 2,
    zIndex: 2,
  },
  fadeTop: { top: 0 },
  fadeBottom: { bottom: 0 },
});
