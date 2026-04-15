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

export type FilterState = {
  maxDistance: number;
  selectedSports: string[];
  skillLevel: SkillLevel | null;
  city: string;
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

const POPULAR_CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL',
  'Houston, TX', 'Miami, FL', 'Seattle, WA',
  'Austin, TX', 'Denver, CO', 'Boston, MA',
  'Atlanta, GA', 'Phoenix, AZ', 'San Diego, CA',
];

const DEFAULT_FILTERS: FilterState = {
  maxDistance: 25,
  selectedSports: [],
  skillLevel: null,
  city: '',
};

export const FilterModal: React.FC<FilterModalProps> = ({
  visible, initial, onClose, onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(initial ?? DEFAULT_FILTERS);
  const [citySearch, setCitySearch] = useState('');

  const toggleSport = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(id)
        ? prev.selectedSports.filter((s) => s !== id)
        : [...prev.selectedSports, id],
    }));
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const activeCount =
    (filters.maxDistance !== DEFAULT_FILTERS.maxDistance ? 1 : 0) +
    filters.selectedSports.length +
    (filters.skillLevel ? 1 : 0) +
    (filters.city ? 1 : 0);

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
              <Text style={styles.activeCount}>{activeCount} active filter{activeCount > 1 ? 's' : ''}</Text>
            )}
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => { setFilters(DEFAULT_FILTERS); setCitySearch(''); }}
              style={styles.resetBtn}
            >
              <Text style={styles.resetText}>Reset all</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── City ────────────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>City</Text>
              {filters.city ? (
                <TouchableOpacity onPress={() => { setFilters((p) => ({ ...p, city: '' })); setCitySearch(''); }} style={styles.clearPill}>
                  <Text style={styles.clearPillText}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Search input */}
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

            {/* City chips */}
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
                    <Ionicons name="location-outline" size={12} color={active ? Colors.primaryDark : Colors.textMuted} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{city}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Distance ─────────────────────────────────── */}
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

          {/* ── Skill Level ───────────────────────────────── */}
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

          {/* ── Sports ────────────────────────────────────── */}
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
    maxHeight: '90%',
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { ...Typography.h3, color: Colors.textPrimary },
  activeCount: { ...Typography.caption, color: Colors.primary, fontWeight: '600', marginTop: 1 },
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

  // City search
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

  // Chips
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
    borderTopWidth: 1,
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
