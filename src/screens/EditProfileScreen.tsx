import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { CURRENT_USER } from '../data/mockUsers';
import { SPORTS } from '../data/sports';
import { RootStackParamList, SkillLevel } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const SKILL_LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
const SKILL_COLORS: Record<SkillLevel, string> = {
  Beginner: Colors.success,
  Intermediate: Colors.primary,
  Advanced: Colors.secondary,
  Pro: Colors.accent,
};
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState(CURRENT_USER.name);
  const [bio, setBio] = useState(CURRENT_USER.bio);
  const [location, setLocation] = useState(CURRENT_USER.location);
  const [selectedSports, setSelectedSports] = useState<string[]>(CURRENT_USER.sports.map((s) => s.id));
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(CURRENT_USER.skillLevel);
  const [availDays, setAvailDays] = useState<string[]>(CURRENT_USER.availability.days);
  const [photos, setPhotos] = useState<string[]>(CURRENT_USER.photos);
  const [saving, setSaving] = useState(false);

  const toggleSport = (id: string) => {
    setSelectedSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: string) => {
    setAvailDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      setSaving(false);
      navigation.goBack();
    }, 900);
  };

  const handleAddPhoto = () => {
    // UI only — would trigger image picker in production
    Alert.alert('Add Photo', 'Image picker would open here in production.');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="close" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, saving && styles.saveBtnSaving]}
          disabled={saving}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtnGrad}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Photo grid ──────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Text style={styles.sectionSub}>Add up to 6 photos. Drag to reorder.</Text>
          <View style={styles.photoGrid}>
            {Array.from({ length: 6 }).map((_, i) => {
              const hasPhoto = photos[i] !== undefined;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.photoSlot, hasPhoto && styles.photoSlotFilled, i === 0 && styles.photoSlotMain]}
                  onPress={handleAddPhoto}
                  activeOpacity={0.8}
                >
                  {hasPhoto ? (
                    <>
                      <Image source={{ uri: photos[i] }} style={styles.photoImg} />
                      <View style={styles.photoEditBadge}>
                        <Ionicons name="pencil" size={10} color={Colors.white} />
                      </View>
                      {i === 0 && (
                        <View style={styles.mainBadge}>
                          <Text style={styles.mainBadgeText}>Main</Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.addPhotoIcon}>
                      <Ionicons name="add" size={28} color={Colors.textMuted} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Basic info ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.fieldInput}>
              <Ionicons name="person-outline" size={17} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.fieldInput}>
              <Ionicons name="location-outline" size={17} color={Colors.textMuted} />
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, State"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <Text style={styles.charCount}>{bio.length}/160</Text>
            </View>
            <View style={[styles.fieldInput, styles.textAreaInput]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={(v) => setBio(v.slice(0, 160))}
                placeholder="Tell people about yourself..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        {/* ── Sports ───────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sports</Text>
          <Text style={styles.sectionSub}>Select all sports you play</Text>
          <View style={styles.sportsGrid}>
            {SPORTS.map((sport) => {
              const active = selectedSports.includes(sport.id);
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

        {/* ── Skill level ──────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Level</Text>
          <View style={styles.skillRow}>
            {SKILL_LEVELS.map((level) => {
              const active = skillLevel === level;
              const color = SKILL_COLORS[level];
              return (
                <TouchableOpacity
                  key={level}
                  onPress={() => setSkillLevel(level)}
                  style={[styles.skillChip, active && { backgroundColor: color, borderColor: color }]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.skillChipText, active && styles.skillChipTextActive]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Availability ─────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <Text style={styles.sectionSub}>When are you available to play?</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const active = availDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  saveBtn: { borderRadius: BorderRadius.lg, overflow: 'hidden', ...Shadow.sm },
  saveBtnSaving: { opacity: 0.7 },
  saveBtnGrad: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm },
  saveBtnText: { ...Typography.label, color: Colors.white, fontWeight: '700' },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary },
  sectionSub: { ...Typography.bodySmall, color: Colors.textMuted, marginTop: -6 },

  // Photo grid
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  photoSlot: {
    width: '30%',
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSlotMain: { width: '63%' },
  photoSlotFilled: { borderStyle: 'solid', borderColor: Colors.primary, borderWidth: 2 },
  photoImg: { width: '100%', height: '100%' },
  photoEditBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(79,195,247,0.88)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  mainBadgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  addPhotoIcon: { alignItems: 'center' },

  // Fields
  field: { gap: Spacing.xs },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  charCount: { ...Typography.caption, color: Colors.textMuted },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  textAreaInput: { alignItems: 'flex-start', paddingTop: Spacing.md },
  input: { flex: 1, ...Typography.body, color: Colors.textPrimary, padding: 0 },
  textArea: { minHeight: 80 },

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

  // Skill
  skillRow: { flexDirection: 'row', gap: Spacing.sm },
  skillChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  skillChipText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  skillChipTextActive: { color: Colors.white },

  // Days
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dayChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },
  dayTextActive: { color: Colors.white },
});
