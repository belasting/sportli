import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPORTS } from '../data/sports';
import { SkillLevel } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

export type GenderOption = 'all' | 'male' | 'female' | 'nonbinary';

export type FilterState = {
  maxDistance: number;
  selectedSports: string[];
  skillLevel: SkillLevel | null;
  city: string;
  ageMin: number;
  ageMax: number;
  gender: GenderOption;
};

export const DEFAULT_FILTER_STATE: FilterState = {
  maxDistance: 25,
  selectedSports: [],
  skillLevel: null,
  city: '',
  ageMin: 18,
  ageMax: 45,
  gender: 'all',
};

interface FilterModalProps {
  visible: boolean;
  initial?: FilterState;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

const DISTANCE_OPTIONS = [1, 5, 10, 25, 50];
const SKILL_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
const SKILL_COLORS: Record<SkillLevel, string> = {
  Beginner: Colors.success,
  Intermediate: Colors.primary,
  Advanced: Colors.secondary,
  Pro: Colors.accent,
};
const GENDER_OPTIONS: { value: GenderOption; label: string; icon: string }[] = [
  { value: 'all', label: 'Everyone', icon: '👥' },
  { value: 'male', label: 'Men', icon: '👨' },
  { value: 'female', label: 'Women', icon: '👩' },
  { value: 'nonbinary', label: 'Non-binary', icon: '🧑' },
];
const POPULAR_CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
  'Houston, TX', 'Miami, FL', 'Seattle, WA',
  'Austin, TX', 'Denver, CO', 'Boston, MA',
  'Atlanta, GA', 'Phoenix, AZ', 'San Diego, CA',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible, initial, onClose, onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(initial ?? DEFAULT_FILTER_STATE);
  const [citySearch, setCitySearch] = useState('');
  const [ageMinText, setAgeMinText] = useState(String(initial?.ageMin ?? DEFAULT_FILTER_STATE.ageMin));
  const [ageMaxText, setAgeMaxText] = useState(String(initial?.ageMax ?? DEFAULT_FILTER_STATE.ageMax));

  const toggleSport = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(id)
        ? prev.selectedSports.filter((s) => s !== id)
        : [...prev.selectedSports, id],
    }));
  };

  const handleAgeMin = (v: string) => {
    setAgeMinText(v);
    const n = parseInt(v);
    if (!isNaN(n) && n >= 13 && n <= filters.ageMax) {
      setFilters((p) => ({ ...p, ageMin: n }));
    }
  };

  const handleAgeMax = (v: string) => {
    setAgeMaxText(v);
    const n = parseInt(v);
    if (!isNaN(n) && n <= 99 && n >= filters.ageMin) {
      setFilters((p) => ({ ...p, ageMax: n }));
    }
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const activeCount =
    (filters.maxDistance !== DEFAULT_FILTER_STATE.maxDistance ? 1 : 0) +
    filters.selectedSports.length +
    (filters.skillLevel ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.gender !== 'all' ? 1 : 0) +
    (filters.ageMin !== DEFAULT_FILTER_STATE.ageMin || filters.ageMax !== DEFAULT_FILTER_STATE.ageMax ? 1 : 0);

  const resetAll = () => {
    setFilters(DEFAULT_FILTER_STATE);
    setCitySearch('');
    setAgeMinText(String(DEFAULT_FILTER_STATE.ageMin));
    setAgeMaxText(String(DEFAULT_FILTER_STATE.ageMax));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Filters</Text>
            {activeCount > 0 && (
              <Text style={styles.activeCount}>{activeCount} active</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={resetAll} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Gender ────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Show Me</Text>
              {filters.gender !== 'all' && (
                <TouchableOpacity
                  onPress={() => setFilters((p) => ({ ...p, gender: 'all' }))}
                  style={styles.clearPill}
                >
                  <Text style={styles.clearPillText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.genderRow}>
              {GENDER_OPTIONS.map((opt) => {
                const active = filters.gender === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setFilters((p) => ({ ...p, gender: opt.value }))}
                    style={[styles.genderChip, active && styles.genderChipActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.genderEmoji}>{opt.icon}</Text>
                    <Text style={[styles.genderText, active && styles.genderTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Age Range ─────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Age Range</Text>
              <View style={styles.valueBadge}>
                <Text style={styles.valueText}>{filters.ageMin}–{filters.ageMax} yrs</Text>
              </View>
            </View>
            <View style={styles.ageRow}>
              <View style={styles.ageInputWrap}>
                <Text style={styles.ageInputLabel}>Min age</Text>
                <View style={styles.ageInputField}>
                  <TextInput
                    style={styles.ageInput}
                    value={ageMinText}
                    onChangeText={handleAgeMin}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>
              <View style={styles.ageDash}>
                <View style={styles.ageDashLine} />
              </View>
              <View style={styles.ageInputWrap}>
                <Text style={styles.ageInputLabel}>Max age</Text>
                <View style={styles.ageInputField}>
                  <TextInput
                    style={styles.ageInput}
                    value={ageMaxText}
                    onChangeText={handleAgeMax}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                    placeholderTextColor={Colors.textMuted}
                  />
                </View>
              </View>
            </View>

            {/* Quick age presets */}
            <View style={styles.chipRow}>
              {[
                { label: '18–25', min: 18, max: 25 },
                { label: '25–35', min: 25, max: 35 },
                { label: '35–45', min: 35, max: 45 },
                { label: '45+', min: 45, max: 99 },
              ].map((preset) => {
                const active = filters.ageMin === preset.min && filters.ageMax === preset.max;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    onPress={() => {
                      setFilters((p) => ({ ...p, ageMin: preset.min, ageMax: preset.max }));
                      setAgeMinText(String(preset.min));
                      setAgeMaxText(String(preset.max));
                    }}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{preset.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── City ────────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>City</Text>
              {filters.city ? (
                <TouchableOpacity
                  onPress={() => { setFilters((p) => ({ ...p, city: '' })); setCitySearch(''); }}
                  style={styles.clearPill}
                >
                  <Text style={styles.clearPillText}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.citySearchBar}>
              <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.citySearchInput}
                placeholder="Search cities…"
                placeholderTextColor={Colors.textMuted}
                value={citySearch}
                onChangeText={setCitySearch}
              />
              {citySearch.length > 0 && (
                <TouchableOpacity onPress={() => setCitySearch('')}>
                  <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.chipRow}>
              {filteredCities.map((city) => {
                const active = filters.city === city;
                return (
                  <TouchableOpacity
                    key={city}
                    onPress={() => setFilters((p) => ({ ...p, city: p.city === city ? '' : city }))}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="location-outline" size={11} color={active ? Colors.primaryDark : Colors.textMuted} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{city}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Distance ─────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Max Distance</Text>
              <View style={styles.valueBadge}>
                <Text style={styles.valueText}>
                  {filters.maxDistance === 50 ? '50+ km' : `${filters.maxDistance} km`}
                </Text>
              </View>
            </View>
            <View style={styles.chipRow}>
              {DISTANCE_OPTIONS.map((d) => {
                const active = filters.maxDistance === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setFilters((p) => ({ ...p, maxDistance: d }))}
                    style={[styles.chip, active && styles.chipActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {d === 50 ? '50+ km' : `${d} km`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Skill Level ──────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Skill Level</Text>
              {filters.skillLevel && (
                <TouchableOpacity
                  onPress={() => setFilters((p) => ({ ...p, skillLevel: null }))}
                  style={styles.clearPill}
                >
                  <Text style={styles.clearPillText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.chipRow}>
              {SKILL_LEVELS.map((level) => {
                const active = filters.skillLevel === level;
                const color = SKILL_COLORS[level];
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() => setFilters((p) => ({ ...p, skillLevel: p.skillLevel === level ? null : level }))}
                    style={[styles.chip, active && { backgroundColor: color, borderColor: color }]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{level}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Sports ───────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="football-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Sports</Text>
              {filters.selectedSports.length > 0 && (
                <TouchableOpacity
                  onPress={() => setFilters((p) => ({ ...p, selectedSports: [] }))}
                  style={styles.clearPill}
                >
                  <Text style={styles.clearPillText}>Clear all</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.sportsGrid}>
              {SPORTS.map((sport) => {
                const active = filters.selectedSports.includes(sport.id);
                return (
                  <TouchableOpacity
                    key={sport.id}
                    onPress={() => toggleSport(sport.id)}
                    style={[styles.sportChip, active && styles.sportChipActive]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                    <Text style={[styles.sportChipText, active && styles.sportChipTextActive]}>
                      {sport.name}
                    </Text>
                    {active && <Ionicons name="checkmark-circle" size={13} color={Colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => onApply(filters)} activeOpacity={0.85} style={styles.applyWrap}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyBtn}
            >
              <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
              <Text style={styles.applyText}>
                Apply{activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    maxHeight: '92%',
    ...Shadow.lg,
  },
  handle: {
    width: 38,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  title: { ...Typography.h3, color: Colors.textPrimary },
  activeCount: { ...Typography.caption, color: Colors.primary, fontWeight: '700', marginTop: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  resetBtn: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  resetText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.base,
    paddingBottom: Spacing['2xl'],
    gap: Spacing['2xl'],
  },
  section: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  valueBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  valueText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '700' },
  clearPill: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  clearPillText: { ...Typography.caption, color: Colors.accent, fontWeight: '600' },

  // Gender
  genderRow: { flexDirection: 'row', gap: Spacing.sm },
  genderChip: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  genderChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  genderEmoji: { fontSize: 20 },
  genderText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  genderTextActive: { color: Colors.primaryDark },

  // Age
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  ageInputWrap: { flex: 1, gap: Spacing.xs },
  ageInputLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  ageInputField: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  ageInput: {
    ...Typography.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
    padding: 0,
    minWidth: 40,
  },
  ageDash: { alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
  ageDashLine: {
    width: 16,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.border,
  },

  // City
  citySearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  citySearchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    padding: 0,
  },

  // Generic chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.primaryDark },

  // Sports
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sportChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  sportEmoji: { fontSize: 13 },
  sportChipText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  sportChipTextActive: { color: Colors.primaryDark },

  // Footer
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 38 : Spacing['2xl'],
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  applyWrap: { borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadow.md },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  applyText: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
});
