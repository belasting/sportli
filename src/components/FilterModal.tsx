import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SPORTS } from '../data/sports';
import { SkillLevel } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

export type FilterState = {
  maxDistance: number; // km
  selectedSports: string[];
  skillLevel: SkillLevel | null;
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

const DEFAULT_FILTERS: FilterState = {
  maxDistance: 25,
  selectedSports: [],
  skillLevel: null,
};

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  initial,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(initial ?? DEFAULT_FILTERS);

  const toggleSport = (sportId: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSports: prev.selectedSports.includes(sportId)
        ? prev.selectedSports.filter((id) => id !== sportId)
        : [...prev.selectedSports, sportId],
    }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
  };

  const activeCount =
    (filters.maxDistance !== DEFAULT_FILTERS.maxDistance ? 1 : 0) +
    filters.selectedSports.length +
    (filters.skillLevel ? 1 : 0);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <View style={styles.sheet}>
        {/* Handle bar */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Filters</Text>
            {activeCount > 0 && (
              <Text style={styles.activeCount}>{activeCount} active</Text>
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
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
              <View style={styles.sectionValueBadge}>
                <Text style={styles.sectionValue}>
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
                    onPress={() => setFilters((prev) => ({ ...prev, maxDistance: d }))}
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

          {/* Skill Level */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="trending-up-outline" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Skill Level</Text>
              {filters.skillLevel && (
                <TouchableOpacity
                  onPress={() => setFilters((prev) => ({ ...prev, skillLevel: null }))}
                  style={styles.clearChip}
                >
                  <Text style={styles.clearChipText}>Clear</Text>
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
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        skillLevel: prev.skillLevel === level ? null : level,
                      }))
                    }
                    style={[
                      styles.chip,
                      active && { backgroundColor: color, borderColor: color },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {level}
                    </Text>
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
                <TouchableOpacity
                  onPress={() => setFilters((prev) => ({ ...prev, selectedSports: [] }))}
                  style={styles.clearChip}
                >
                  <Text style={styles.clearChipText}>Clear all</Text>
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
                    {active && (
                      <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Apply button */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleApply} activeOpacity={0.85} style={styles.applyWrapper}>
            <LinearGradient
              colors={[Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyBtn}
            >
              <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
              <Text style={styles.applyText}>
                Apply Filters{activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    maxHeight: '88%',
    ...Shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
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
  activeCount: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  resetBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
  },
  resetText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.base,
    paddingBottom: Spacing['2xl'],
    gap: Spacing['2xl'],
  },
  section: { gap: Spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  sectionValueBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  sectionValue: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '700' },
  clearChip: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  clearChipText: { ...Typography.caption, color: Colors.accent, fontWeight: '600' },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  chipText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.primaryDark },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
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
  sportChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  sportEmoji: { fontSize: 14 },
  sportChipText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  sportChipTextActive: { color: Colors.primaryDark },
  footer: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  applyWrapper: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.md,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
  },
  applyText: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
});
