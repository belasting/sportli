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
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SPORTS } from '../data/sports';
import { MOCK_USERS } from '../data/mockUsers';
import { RootStackParamList, Sport } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateGroup'>;
};

const COVER_EMOJIS = ['🏀', '⚽', '🎾', '🏐', '🏃', '🚴', '🏊', '🧘', '💪', '⛳', '🥊', '🏸', '🧗', '🏄', '⚾', '🏒'];

const SPORT_GRADIENTS: Record<string, readonly [string, string]> = {
  basketball: ['#FF9800', '#F44336'],
  soccer: ['#4CAF50', '#2E7D32'],
  tennis: ['#FFEB3B', '#F9A825'],
  running: ['#4FC3F7', '#0288D1'],
  yoga: ['#CE93D8', '#7B1FA2'],
  climbing: ['#A5D6A7', '#2E7D32'],
  gym: ['#90A4AE', '#37474F'],
  cycling: ['#80DEEA', '#006064'],
  swimming: ['#29B6F6', '#01579B'],
  golf: ['#AED581', '#558B2F'],
  boxing: ['#EF9A9A', '#C62828'],
  badminton: ['#FFE082', '#FF8F00'],
  surfing: ['#4DD0E1', '#006064'],
  baseball: ['#FFCC80', '#E65100'],
  hockey: ['#B0BEC5', '#263238'],
  volleyball: ['#F48FB1', '#880E4F'],
};

export const CreateGroupScreen: React.FC<Props> = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [coverEmoji, setCoverEmoji] = useState('🏃');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [maxMembers, setMaxMembers] = useState('20');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const gradient = selectedSport
    ? (SPORT_GRADIENTS[selectedSport.id] ?? ['#4FC3F7', '#0288D1'])
    : (['#4FC3F7', '#0288D1'] as const);

  const canProceed1 = groupName.trim().length >= 3 && selectedSport !== null;
  const canCreate = canProceed1;

  const handleCreate = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient colors={gradient as any} style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.emojiPreview}>
            <Text style={styles.emojiPreviewText}>{coverEmoji}</Text>
          </View>
          <Text style={styles.headerTitle}>
            {groupName.trim() || 'New Group'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {selectedSport ? selectedSport.name : 'Select a sport'}
          </Text>
        </View>
        {/* Step indicator */}
        <View style={styles.stepRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Step 1: Group Details */}
        {step === 1 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Group Details</Text>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Group Name *</Text>
                <TextInput
                  style={styles.input}
                  value={groupName}
                  onChangeText={setGroupName}
                  placeholder="e.g. Brooklyn Ballers"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={40}
                />
                <Text style={styles.charCount}>{groupName.length}/40</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="What's this group about?"
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  maxLength={200}
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>{description.length}/200</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Max Members</Text>
                <View style={styles.maxMembersRow}>
                  {['10', '20', '50', '100'].map((n) => (
                    <TouchableOpacity
                      key={n}
                      style={[styles.maxMemberChip, maxMembers === n && styles.maxMemberChipActive]}
                      onPress={() => setMaxMembers(n)}
                    >
                      <Text style={[styles.maxMemberText, maxMembers === n && styles.maxMemberTextActive]}>
                        {n}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sport *</Text>
              <View style={styles.sportsGrid}>
                {SPORTS.map((sport) => {
                  const selected = selectedSport?.id === sport.id;
                  return (
                    <TouchableOpacity
                      key={sport.id}
                      style={[styles.sportChip, selected && styles.sportChipActive]}
                      onPress={() => {
                        setSelectedSport(sport);
                        setCoverEmoji(COVER_EMOJIS[SPORTS.indexOf(sport)] ?? '🏃');
                      }}
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

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cover Emoji</Text>
              <View style={styles.emojiGrid}>
                {COVER_EMOJIS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    style={[styles.emojiBtn, coverEmoji === e && styles.emojiBtnActive]}
                    onPress={() => setCoverEmoji(e)}
                  >
                    <Text style={styles.emojiText}>{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.nextBtn, !canProceed1 && styles.nextBtnDisabled]}
              onPress={() => canProceed1 && setStep(2)}
              disabled={!canProceed1}
            >
              <Text style={styles.nextBtnText}>Next: Add Members</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Members */}
        {step === 2 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invite Members</Text>
              <Text style={styles.sectionHint}>
                Select people from your matches to invite ({selectedMembers.length} selected)
              </Text>
              {MOCK_USERS.map((user) => {
                const selected = selectedMembers.includes(user.id);
                return (
                  <TouchableOpacity
                    key={user.id}
                    style={[styles.memberRow, selected && styles.memberRowActive]}
                    onPress={() => toggleMember(user.id)}
                  >
                    <Image source={{ uri: user.photos[0] }} style={styles.memberAvatar} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{user.name}</Text>
                      <Text style={styles.memberMeta}>
                        {user.sports[0]?.emoji} {user.sports.map((s) => s.name).join(', ')}
                      </Text>
                    </View>
                    <View style={[styles.checkCircle, selected && styles.checkCircleActive]}>
                      {selected && <Ionicons name="checkmark" size={14} color={Colors.white} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backNavBtn} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
                <Text style={styles.backNavText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(3)}>
                <Text style={styles.nextBtnText}>Review</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Step 3: Review + Create */}
        {step === 3 && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Review</Text>

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Name</Text>
                <Text style={styles.reviewValue}>{groupName}</Text>
              </View>
              <View style={styles.reviewDivider} />

              {description.trim().length > 0 && (
                <>
                  <View style={styles.reviewItem}>
                    <Text style={styles.reviewLabel}>Description</Text>
                    <Text style={styles.reviewValue}>{description}</Text>
                  </View>
                  <View style={styles.reviewDivider} />
                </>
              )}

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Sport</Text>
                <Text style={styles.reviewValue}>{selectedSport?.emoji} {selectedSport?.name}</Text>
              </View>
              <View style={styles.reviewDivider} />

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Max Members</Text>
                <Text style={styles.reviewValue}>{maxMembers}</Text>
              </View>
              <View style={styles.reviewDivider} />

              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Members Invited</Text>
                <Text style={styles.reviewValue}>{selectedMembers.length} people</Text>
              </View>
            </View>

            <View style={styles.navRow}>
              <TouchableOpacity style={styles.backNavBtn} onPress={() => setStep(2)}>
                <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
                <Text style={styles.backNavText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <LinearGradient
                  colors={gradient as any}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="people" size={20} color={Colors.white} />
                <Text style={styles.createBtnText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 40,
    left: Spacing['2xl'],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center', gap: Spacing.xs },
  emojiPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiPreviewText: { fontSize: 28 },
  headerTitle: { ...Typography.h3, color: Colors.white, fontWeight: '800' },
  headerSubtitle: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)' },
  stepRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  stepDot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: { backgroundColor: Colors.white },

  scroll: { padding: Spacing.base, paddingBottom: 100 },

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
  inputMultiline: { height: 90, paddingTop: Spacing.md },
  charCount: { ...Typography.caption, color: Colors.textMuted, alignSelf: 'flex-end' },

  maxMembersRow: { flexDirection: 'row', gap: Spacing.sm },
  maxMemberChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  maxMemberChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  maxMemberText: { ...Typography.labelLarge, color: Colors.textSecondary },
  maxMemberTextActive: { color: Colors.primary, fontWeight: '700' },

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
  sportChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  sportEmoji: { fontSize: 16 },
  sportName: { ...Typography.label, color: Colors.textSecondary },
  sportNameActive: { color: Colors.primary, fontWeight: '700' },

  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  emojiBtnActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  emojiText: { fontSize: 24 },

  // Members
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
  },
  memberRowActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  memberAvatar: { width: 44, height: 44, borderRadius: 22 },
  memberInfo: { flex: 1 },
  memberName: { ...Typography.labelLarge, color: Colors.textPrimary },
  memberMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },

  // Review
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
  },
  reviewLabel: { ...Typography.label, color: Colors.textMuted },
  reviewValue: { ...Typography.body, color: Colors.textPrimary, flex: 1, textAlign: 'right' },
  reviewDivider: { height: 1, backgroundColor: Colors.border },

  // Nav
  navRow: { flexDirection: 'row', gap: Spacing.base, alignItems: 'center', marginTop: Spacing.sm },
  backNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  backNavText: { ...Typography.label, color: Colors.textSecondary },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.base,
    ...Shadow.sm,
  },
  nextBtnDisabled: { opacity: 0.45 },
  nextBtnText: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
  createBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.base,
    overflow: 'hidden',
    ...Shadow.md,
  },
  createBtnText: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
});
