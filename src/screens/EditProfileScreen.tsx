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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CURRENT_USER } from '../data/mockUsers';
import { SPORTS } from '../data/sports';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
};

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Pro'] as const;
const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening', 'Weekends'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState(CURRENT_USER.name);
  const [bio, setBio] = useState(CURRENT_USER.bio);
  const [location, setLocation] = useState(CURRENT_USER.location);
  const [selectedSports, setSelectedSports] = useState<string[]>(
    CURRENT_USER.sports.map((s) => s.id)
  );
  const [skillLevel, setSkillLevel] = useState(CURRENT_USER.skillLevel);
  const [selectedDays, setSelectedDays] = useState<string[]>(CURRENT_USER.availability.days);
  const [selectedSlots, setSelectedSlots] = useState<string[]>(CURRENT_USER.availability.timeSlots);

  const toggleSport = (id: string) => {
    setSelectedSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSave = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Photo section */}
        <View style={styles.photoSection}>
          <View style={styles.mainPhotoWrap}>
            <Image source={{ uri: CURRENT_USER.photos[0] }} style={styles.mainPhoto} />
            <TouchableOpacity style={styles.photoEditBtn}>
              <Ionicons name="camera" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View style={styles.extraPhotos}>
            {[1, 2, 3].map((i) => (
              <TouchableOpacity key={i} style={styles.extraPhotoSlot}>
                {CURRENT_USER.photos[i] ? (
                  <Image source={{ uri: CURRENT_USER.photos[i] }} style={styles.extraPhoto} />
                ) : (
                  <Ionicons name="add" size={24} color={Colors.textMuted} />
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.photoHint}>Add up to 6 photos. Your first photo is your main photo.</Text>
        </View>

        {/* Basic info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell people about yourself..."
              placeholderTextColor={Colors.textMuted}
              multiline
              maxLength={300}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{bio.length}/300</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0, paddingHorizontal: 0 }]}
                value={location}
                onChangeText={setLocation}
                placeholder="City, State"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* Sports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sports</Text>
          <Text style={styles.sectionHint}>Select the sports you play</Text>
          <View style={styles.sportsGrid}>
            {SPORTS.map((sport) => {
              const selected = selectedSports.includes(sport.id);
              return (
                <TouchableOpacity
                  key={sport.id}
                  style={[styles.sportChip, selected && styles.sportChipActive]}
                  onPress={() => toggleSport(sport.id)}
                >
                  <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                  <Text style={[styles.sportName, selected && styles.sportNameActive]}>
                    {sport.name}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Skill level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Level</Text>
          <View style={styles.skillRow}>
            {SKILL_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.skillBtn, skillLevel === level && styles.skillBtnActive]}
                onPress={() => setSkillLevel(level)}
              >
                <Text style={[styles.skillBtnText, skillLevel === level && styles.skillBtnTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <Text style={styles.fieldLabel}>Days</Text>
          <View style={styles.daysRow}>
            {DAYS.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayChip, active && styles.dayChipActive]}
                  onPress={() => toggleDay(day)}
                >
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>Time Slots</Text>
          <View style={styles.slotsRow}>
            {TIME_SLOTS.map((slot) => {
              const active = selectedSlots.includes(slot);
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotChip, active && styles.slotChipActive]}
                  onPress={() => toggleSlot(slot)}
                >
                  <Text style={[styles.slotText, active && styles.slotTextActive]}>{slot}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtnLarge} onPress={handleSave}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
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
  headerBtn: { minWidth: 60 },
  cancelText: { ...Typography.body, color: Colors.textSecondary },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  saveBtn: { minWidth: 60, alignItems: 'flex-end' },
  saveText: { ...Typography.labelLarge, color: Colors.primary },

  scroll: { padding: Spacing.base, paddingBottom: 100 },

  // Photos
  photoSection: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    gap: Spacing.base,
    ...Shadow.sm,
  },
  mainPhotoWrap: { position: 'relative' },
  mainPhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  photoEditBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  extraPhotos: { flexDirection: 'row', gap: Spacing.sm },
  extraPhotoSlot: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  extraPhoto: { width: '100%', height: '100%' },
  photoHint: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center' },

  // Sections
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    gap: Spacing.base,
    ...Shadow.sm,
  },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary },
  sectionHint: { ...Typography.caption, color: Colors.textMuted, marginTop: -Spacing.sm },

  field: { gap: Spacing.xs },
  fieldLabel: { ...Typography.label, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inputMultiline: { height: 100, paddingTop: Spacing.md },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  charCount: { ...Typography.caption, color: Colors.textMuted, alignSelf: 'flex-end' },

  // Sports
  sportsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sportChipActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  sportEmoji: { fontSize: 16 },
  sportName: { ...Typography.label, color: Colors.textSecondary },
  sportNameActive: { color: Colors.primary, fontWeight: '700' },

  // Skill level
  skillRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  skillBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    minWidth: 80,
  },
  skillBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  skillBtnText: { ...Typography.label, color: Colors.textSecondary },
  skillBtnTextActive: { color: Colors.white, fontWeight: '700' },

  // Availability
  daysRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  dayChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { ...Typography.label, color: Colors.textMuted },
  dayTextActive: { color: Colors.white, fontWeight: '700' },

  slotsRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  slotChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  slotChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  slotText: { ...Typography.label, color: Colors.textSecondary },
  slotTextActive: { color: Colors.white, fontWeight: '700' },

  // Save button
  saveBtnLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.full,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  saveBtnText: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
});
