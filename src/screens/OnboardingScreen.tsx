import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList, OnboardingData, SkillLevel } from '../types';
import { SPORTS } from '../data/sports';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAnimatedPress } from '../hooks/useAnimatedPress';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_STEPS = 5;

const SKILL_LEVELS: { level: SkillLevel; icon: string; desc: string; emoji: string }[] = [
  { level: 'Beginner', icon: 'sprout', desc: 'Just getting started', emoji: '🌱' },
  { level: 'Intermediate', icon: 'trending-up', desc: 'Know the basics well', emoji: '📈' },
  { level: 'Advanced', icon: 'star', desc: 'Played competitively', emoji: '⭐' },
  { level: 'Pro', icon: 'trophy', desc: 'Elite level player', emoji: '🏆' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_SLOTS = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Late Night'];
const MOCK_PHOTO_URL = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=400&q=80';

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    selectedSports: [],
    skillLevel: null,
    availability: { days: [], timeSlots: [] },
    location: '',
    photos: [],
  });

  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const goNext = () => {
    if (step < TOTAL_STEPS - 1) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -SCREEN_WIDTH, duration: 250, useNativeDriver: true }),
        Animated.timing(progressAnim, {
          toValue: (step + 1) / (TOTAL_STEPS - 1),
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start(() => {
        slideAnim.setValue(SCREEN_WIDTH);
        setStep(step + 1);
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
      });
    } else {
      (navigation as any).replace('Main');
    }
  };

  const goBack = () => {
    if (step > 0) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: SCREEN_WIDTH, duration: 250, useNativeDriver: true }),
        Animated.timing(progressAnim, {
          toValue: (step - 1) / (TOTAL_STEPS - 1),
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start(() => {
        slideAnim.setValue(-SCREEN_WIDTH);
        setStep(step - 1);
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
      });
    }
  };

  const canContinue = (() => {
    switch (step) {
      case 0: return data.selectedSports.length > 0;
      case 1: return data.skillLevel !== null;
      case 2: return data.availability.days.length > 0;
      case 3: return true;
      case 4: return true;
      default: return true;
    }
  })();

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SportSelectionStep data={data} setData={setData} />;
      case 1:
        return <SkillLevelStep data={data} setData={setData} />;
      case 2:
        return <AvailabilityStep data={data} setData={setData} />;
      case 3:
        return <LocationStep data={data} setData={setData} />;
      case 4:
        return <PhotoStep data={data} setData={setData} />;
      default:
        return null;
    }
  };

  const stepMeta = [
    { title: 'Your Sports', subtitle: 'What do you love to play?' },
    { title: 'Skill Level', subtitle: 'How good are you?' },
    { title: 'Availability', subtitle: 'When can you play?' },
    { title: 'Location', subtitle: 'Where are you based?' },
    { title: 'Profile Photo', subtitle: 'Let people see the real you!' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.stepCount}>{step + 1} of {TOTAL_STEPS}</Text>
      </View>

      {/* Back button */}
      {step > 0 && (
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      )}

      {/* Step header */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>{stepMeta[step].title}</Text>
        <Text style={styles.stepSubtitle}>{stepMeta[step].subtitle}</Text>
      </View>

      {/* Animated step content */}
      <Animated.View
        style={[styles.stepContent, { transform: [{ translateX: slideAnim }] }]}
      >
        {renderStep()}
      </Animated.View>

      {/* Footer */}
      <View style={styles.footer}>
        <AnimatedButton
          label={step === TOTAL_STEPS - 1 ? "Let's Go! 🚀" : 'Continue'}
          onPress={goNext}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canContinue}
        />
        {step === TOTAL_STEPS - 1 && (
          <TouchableOpacity onPress={goNext}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── Step Components ──────────────────────────────────────────────────────────

const SportSelectionStep: React.FC<{ data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }> = ({ data, setData }) => {
  const toggleSport = (id: string) => {
    setData((prev) => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(id)
        ? prev.selectedSports.filter((s) => s !== id)
        : [...prev.selectedSports, id],
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ss.grid}>
      {SPORTS.map((sport) => {
        const selected = data.selectedSports.includes(sport.id);
        return (
          <SportTile
            key={sport.id}
            sport={sport}
            selected={selected}
            onPress={() => toggleSport(sport.id)}
          />
        );
      })}
    </ScrollView>
  );
};

const SportTile: React.FC<{ sport: any; selected: boolean; onPress: () => void }> = ({ sport, selected, onPress }) => {
  const { scaleAnim, onPressIn, onPressOut } = useAnimatedPress(0.9);
  return (
    <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
      <Animated.View
        style={[
          ss.tile,
          selected && ss.tileSelected,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {selected && (
          <View style={ss.checkBadge}>
            <Ionicons name="checkmark" size={12} color={Colors.white} />
          </View>
        )}
        <Text style={ss.tileEmoji}>{sport.emoji}</Text>
        <Text style={[ss.tileName, selected && ss.tileNameSelected]}>{sport.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const SkillLevelStep: React.FC<{ data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }> = ({ data, setData }) => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sk.container}>
    {SKILL_LEVELS.map(({ level, desc, emoji }) => {
      const selected = data.skillLevel === level;
      return (
        <TouchableOpacity
          key={level}
          onPress={() => setData((p) => ({ ...p, skillLevel: level }))}
        >
          <View style={[sk.card, selected && sk.cardSelected]}>
            <Text style={sk.emoji}>{emoji}</Text>
            <View style={sk.textGroup}>
              <Text style={[sk.level, selected && sk.levelSelected]}>{level}</Text>
              <Text style={sk.desc}>{desc}</Text>
            </View>
            {selected && (
              <View style={sk.check}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const AvailabilityStep: React.FC<{ data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }> = ({ data, setData }) => {
  const toggleDay = (day: string) => {
    setData((p) => ({
      ...p,
      availability: {
        ...p.availability,
        days: p.availability.days.includes(day)
          ? p.availability.days.filter((d) => d !== day)
          : [...p.availability.days, day],
      },
    }));
  };

  const toggleSlot = (slot: string) => {
    setData((p) => ({
      ...p,
      availability: {
        ...p.availability,
        timeSlots: p.availability.timeSlots.includes(slot)
          ? p.availability.timeSlots.filter((s) => s !== slot)
          : [...p.availability.timeSlots, slot],
      },
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={av.container}>
      <Text style={av.sectionLabel}>Days</Text>
      <View style={av.daysRow}>
        {DAYS.map((day) => {
          const active = data.availability.days.includes(day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              style={[av.dayChip, active && av.dayChipActive]}
            >
              <Text style={[av.dayText, active && av.dayTextActive]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={av.sectionLabel}>Time Slots</Text>
      <View style={av.slotsGrid}>
        {TIME_SLOTS.map((slot) => {
          const active = data.availability.timeSlots.includes(slot);
          const icons: Record<string, string> = {
            'Early Morning': '🌅', Morning: '☀️', Afternoon: '🌤️',
            Evening: '🌆', 'Late Night': '🌙',
          };
          return (
            <TouchableOpacity
              key={slot}
              onPress={() => toggleSlot(slot)}
              style={[av.slotCard, active && av.slotCardActive]}
            >
              <Text style={av.slotEmoji}>{icons[slot]}</Text>
              <Text style={[av.slotText, active && av.slotTextActive]}>{slot}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const LocationStep: React.FC<{ data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }> = ({ data, setData }) => {
  const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Miami, FL', 'Seattle, WA'];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={loc.container}>
      <View style={loc.mapMock}>
        <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={StyleSheet.absoluteFill} />
        <MaterialCommunityIcons name="map-marker-radius" size={64} color={Colors.primary} />
        <Text style={loc.mapText}>Tap a city or use GPS</Text>
      </View>

      <TouchableOpacity style={loc.gpsBtn}>
        <Ionicons name="navigate" size={18} color={Colors.white} />
        <Text style={loc.gpsBtnText}>Use My Location</Text>
      </TouchableOpacity>

      <Text style={loc.orText}>— or pick a city —</Text>

      <View style={loc.citiesGrid}>
        {cities.map((city) => {
          const active = data.location === city;
          return (
            <TouchableOpacity
              key={city}
              onPress={() => setData((p) => ({ ...p, location: city }))}
              style={[loc.cityChip, active && loc.cityChipActive]}
            >
              <Ionicons
                name="location"
                size={14}
                color={active ? Colors.white : Colors.textSecondary}
              />
              <Text style={[loc.cityText, active && loc.cityTextActive]}>{city}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const PhotoStep: React.FC<{ data: OnboardingData; setData: React.Dispatch<React.SetStateAction<OnboardingData>> }> = ({ data, setData }) => {
  const addMockPhoto = () => {
    setData((p) => ({ ...p, photos: [...p.photos, MOCK_PHOTO_URL] }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ph.container}>
      <Text style={ph.hint}>Add up to 6 photos to stand out</Text>
      <View style={ph.grid}>
        {Array.from({ length: 6 }).map((_, i) => {
          const hasPhoto = data.photos[i] !== undefined;
          return (
            <TouchableOpacity
              key={i}
              style={[ph.photoSlot, hasPhoto && ph.photoSlotFilled]}
              onPress={addMockPhoto}
            >
              {hasPhoto ? (
                <Image source={{ uri: data.photos[i] }} style={ph.photo} />
              ) : (
                <View style={ph.addIcon}>
                  <Ionicons
                    name={i === 0 ? 'person-add' : 'add'}
                    size={i === 0 ? 36 : 26}
                    color={Colors.textMuted}
                  />
                  {i === 0 && <Text style={ph.mainPhotoLabel}>Main Photo</Text>}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={ph.tips}>
        {['Clear face shot', 'Action/sport photo', 'Show your personality'].map((tip) => (
          <View key={tip} style={ph.tip}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={ph.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// ─── Step Stylesheets ─────────────────────────────────────────────────────────

const ss = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  tile: {
    width: (SCREEN_WIDTH - Spacing['2xl'] * 2 - Spacing.md * 3) / 4,
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tileSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmoji: { fontSize: 26 },
  tileName: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  tileNameSelected: { color: Colors.primaryDark, fontWeight: '600' },
});

const sk = StyleSheet.create({
  container: { gap: Spacing.md, paddingBottom: Spacing['2xl'] },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  emoji: { fontSize: 32 },
  textGroup: { flex: 1 },
  level: { ...Typography.h4, color: Colors.textPrimary },
  levelSelected: { color: Colors.primaryDark },
  desc: { ...Typography.bodySmall, color: Colors.textSecondary },
  check: { marginLeft: 'auto' },
});

const av = StyleSheet.create({
  container: { gap: Spacing.xl, paddingBottom: Spacing['2xl'] },
  sectionLabel: { ...Typography.h4, color: Colors.textPrimary },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dayChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { ...Typography.label, color: Colors.textSecondary },
  dayTextActive: { color: Colors.white },
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  slotCard: {
    width: (SCREEN_WIDTH - Spacing['2xl'] * 2 - Spacing.md * 2) / 3,
    paddingVertical: Spacing.base,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  slotCardActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  slotEmoji: { fontSize: 22 },
  slotText: { ...Typography.labelSmall, color: Colors.textSecondary, textAlign: 'center' },
  slotTextActive: { color: Colors.primaryDark },
});

const loc = StyleSheet.create({
  container: { gap: Spacing.xl, paddingBottom: Spacing['2xl'] },
  mapMock: {
    height: 160,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  mapText: { ...Typography.label, color: Colors.primaryDark },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
  },
  gpsBtnText: { ...Typography.labelLarge, color: Colors.white },
  orText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
  citiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cityChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  cityText: { ...Typography.label, color: Colors.textSecondary },
  cityTextActive: { color: Colors.white },
});

const ph = StyleSheet.create({
  container: { gap: Spacing.xl, paddingBottom: Spacing['2xl'] },
  hint: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  photoSlot: {
    width: (SCREEN_WIDTH - Spacing['2xl'] * 2 - Spacing.md * 2) / 3,
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  photoSlotFilled: { borderStyle: 'solid', borderColor: Colors.primary },
  photo: { width: '100%', height: '100%' },
  addIcon: { alignItems: 'center', gap: 4 },
  mainPhotoLabel: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },
  tips: { gap: Spacing.sm },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  tipText: { ...Typography.body, color: Colors.textSecondary },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  progressContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: Spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  stepCount: { ...Typography.caption, color: Colors.textMuted, minWidth: 40, textAlign: 'right' },
  backBtn: {
    marginTop: Spacing.base,
    marginLeft: Spacing.xl,
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepHeader: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
    gap: Spacing.xs,
  },
  stepTitle: { ...Typography.h1, color: Colors.textPrimary },
  stepSubtitle: { ...Typography.bodyLarge, color: Colors.textSecondary },
  stepContent: { flex: 1, paddingHorizontal: Spacing['2xl'] },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing['2xl'],
    paddingTop: Spacing.base,
    gap: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  skipText: { ...Typography.body, color: Colors.textMuted },
});
