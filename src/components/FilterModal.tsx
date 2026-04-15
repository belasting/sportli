import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FilterState, SkillLevel } from '../types';
import { SPORTS } from '../data/sports';
import { AnimatedButton } from './AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CITIES = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Miami',
  'Austin', 'Seattle', 'Denver', 'Boston', 'Atlanta',
  'Amsterdam', 'London', 'Berlin', 'Paris', 'Barcelona',
];

const SKILL_LEVELS: { level: SkillLevel; emoji: string }[] = [
  { level: 'Beginner', emoji: '🌱' },
  { level: 'Intermediate', emoji: '📈' },
  { level: 'Advanced', emoji: '⭐' },
  { level: 'Pro', emoji: '🏆' },
];

// ─── Custom Slider ────────────────────────────────────────────────────────────

const DistanceSlider: React.FC<{
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}> = ({ value, min, max, onChange }) => {
  const [trackWidth, setTrackWidth] = useState(1);
  const pct = (value - min) / (max - min);

  return (
    <View style={sl.wrapper}>
      <View
        style={sl.track}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        onStartShouldSetResponder={() => true}
        onResponderMove={(e) => {
          const x = Math.max(0, Math.min(trackWidth, e.nativeEvent.locationX));
          const raw = min + (x / trackWidth) * (max - min);
          onChange(Math.round(raw / 5) * 5); // snap to 5km steps
        }}
        onResponderRelease={(e) => {
          const x = Math.max(0, Math.min(trackWidth, e.nativeEvent.locationX));
          const raw = min + (x / trackWidth) * (max - min);
          onChange(Math.round(raw / 5) * 5);
        }}
      >
        {/* Track fill */}
        <View style={[sl.fill, { width: `${pct * 100}%` }]} />
        {/* Thumb */}
        <View style={[sl.thumb, { left: `${pct * 100}%` }]}>
          <View style={sl.thumbInner} />
        </View>
      </View>
      <View style={sl.labels}>
        <Text style={sl.labelText}>{min} km</Text>
        <Text style={sl.valueText}>{value === max ? `${max}+ km` : `${value} km`}</Text>
        <Text style={sl.labelText}>{max} km</Text>
      </View>
    </View>
  );
};

const sl = StyleSheet.create({
  wrapper: { gap: Spacing.md },
  track: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    position: 'relative',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  thumb: {
    position: 'absolute',
    width: 26,
    height: 26,
    marginLeft: -13,
    borderRadius: 13,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
    top: -10,
  },
  thumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelText: { ...Typography.caption, color: Colors.textMuted },
  valueText: { ...Typography.labelLarge, color: Colors.primary },
});

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface FilterModalProps {
  visible: boolean;
  current: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  current,
  onApply,
  onClose,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const [filters, setFilters] = useState<FilterState>(current);
  const [citySearch, setCitySearch] = useState('');

  useEffect(() => {
    if (visible) {
      setFilters(current);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const toggleSport = (id: string) => {
    setFilters((f) => ({
      ...f,
      selectedSports: f.selectedSports.includes(id)
        ? f.selectedSports.filter((s) => s !== id)
        : [...f.selectedSports, id],
    }));
  };

  const filteredCities = citySearch.trim()
    ? CITIES.filter((c) => c.toLowerCase().includes(citySearch.toLowerCase()))
    : CITIES;

  const activeCount =
    (filters.maxDistance < 50 ? 1 : 0) +
    (filters.selectedSports.length > 0 ? 1 : 0) +
    (filters.skillLevel ? 1 : 0) +
    (filters.city ? 1 : 0);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View
        style={[styles.backdrop, { opacity: backdropAnim }]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Filters</Text>
            {activeCount > 0 && (
              <Text style={styles.activeCount}>{activeCount} active filter{activeCount > 1 ? 's' : ''}</Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => { setFilters({ maxDistance: 50, selectedSports: [], skillLevel: null, city: null }); setCitySearch(''); }}
            style={styles.resetBtn}
          >
            <Text style={styles.resetText}>Reset all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Distance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Max Distance</Text>
            </View>
            <DistanceSlider
              value={filters.maxDistance}
              min={1}
              max={50}
              onChange={(v) => setFilters((f) => ({ ...f, maxDistance: v }))}
            />
          </View>

          {/* City */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="business-outline" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>City</Text>
              {filters.city && (
                <TouchableOpacity onPress={() => setFilters((f) => ({ ...f, city: null }))}>
                  <Text style={styles.clearCity}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.citySearchWrap}>
              <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.citySearchInput}
                value={citySearch}
                onChangeText={setCitySearch}
                placeholder="Search city..."
                placeholderTextColor={Colors.textMuted}
              />
              {citySearch.length > 0 && (
                <TouchableOpacity onPress={() => setCitySearch('')}>
                  <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.sportsGrid}>
              {filteredCities.map((city) => {
                const selected = filters.city === city;
                return (
                  <TouchableOpacity
                    key={city}
                    style={[styles.sportChip, selected && styles.sportChipActive]}
                    onPress={() => setFilters((f) => ({ ...f, city: f.city === city ? null : city }))}
                  >
                    <Ionicons name="location" size={12} color={selected ? Colors.primary : Colors.textMuted} />
                    <Text style={[styles.sportName, selected && styles.sportNameActive]}>{city}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Sports */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="football-outline" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Sports</Text>
              {filters.selectedSports.length > 0 && (
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{filters.selectedSports.length}</Text>
                </View>
              )}
            </View>
            <View style={styles.sportsGrid}>
              {SPORTS.map((sport) => {
                const selected = filters.selectedSports.includes(sport.id);
                return (
                  <TouchableOpacity
                    key={sport.id}
                    onPress={() => toggleSport(sport.id)}
                    style={[styles.sportChip, selected && styles.sportChipActive]}
                  >
                    <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                    <Text style={[styles.sportName, selected && styles.sportNameActive]}>
                      {sport.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Skill level */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trophy-outline" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Skill Level</Text>
            </View>
            <View style={styles.skillRow}>
              {SKILL_LEVELS.map(({ level, emoji }) => {
                const active = filters.skillLevel === level;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() =>
                      setFilters((f) => ({
                        ...f,
                        skillLevel: f.skillLevel === level ? null : level,
                      }))
                    }
                    style={[styles.skillChip, active && styles.skillChipActive]}
                  >
                    <Text style={styles.skillEmoji}>{emoji}</Text>
                    <Text style={[styles.skillText, active && styles.skillTextActive]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply */}
        <View style={styles.footer}>
          <AnimatedButton
            label={`Apply Filters${activeCount > 0 ? ` (${activeCount})` : ''}`}
            onPress={() => {
              onApply(filters);
              onClose();
            }}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="checkmark" size={18} color={Colors.white} />}
          />
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: SCREEN_HEIGHT * 0.88,
    ...Shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { ...Typography.h3, color: Colors.textPrimary },
  activeCount: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  resetBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
  },
  resetText: { ...Typography.label, color: Colors.textSecondary },
  scrollContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.xl,
    gap: Spacing['2xl'],
  },
  section: { gap: Spacing.base },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  sectionBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBadgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  clearCity: { ...Typography.label, color: Colors.primary, fontWeight: '600' },
  citySearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  citySearchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sportChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  sportEmoji: { fontSize: 14 },
  sportName: { ...Typography.label, color: Colors.textSecondary },
  sportNameActive: { color: Colors.primaryDark, fontWeight: '700' },
  skillRow: { flexDirection: 'row', gap: Spacing.sm },
  skillChip: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  skillChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  skillEmoji: { fontSize: 20 },
  skillText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  skillTextActive: { color: Colors.primaryDark },
  footer: {
    padding: Spacing['2xl'],
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
