import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  Switch,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CURRENT_USER } from '../data/mockUsers';
import { SportBadge } from '../components/SportBadge';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [notifications, setNotifications] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  const stats = [
    { value: '47', label: 'Likes' },
    { value: '12', label: 'Matches' },
    { value: '8', label: 'Meetups' },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" />

        {/* ── Hero ──────────────────────────────────────── */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['#0f2460', Colors.primaryDark, '#1a8fcf']}
            style={StyleSheet.absoluteFill}
          />

          {/* Top bar inside hero */}
          <View style={styles.heroTopBar}>
            <Text style={styles.heroScreenTitle}>My Profile</Text>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setShowMenu(true)}>
              <Ionicons name="ellipsis-horizontal" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Avatar */}
          <View style={styles.avatarArea}>
            <View style={styles.avatarRing}>
              <Image source={{ uri: CURRENT_USER.photos[0] }} style={styles.avatar} />
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Name + location */}
          <View style={styles.nameArea}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{CURRENT_USER.name}</Text>
              {CURRENT_USER.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color={Colors.primaryLight} />
              )}
            </View>
            <Text style={styles.locationText}>📍 {CURRENT_USER.location}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
                {i < stats.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </View>

          {/* Edit profile button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="create-outline" size={15} color={Colors.white} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Premium card ──────────────────────────────── */}
        <TouchableOpacity style={styles.premiumCard} onPress={() => navigation.navigate('Premium')}>
          <LinearGradient colors={[Colors.secondary, '#FF5722']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <MaterialCommunityIcons name="crown" size={24} color={Colors.white} />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Upgrade to Sportli+</Text>
            <Text style={styles.premiumSub}>Unlimited swipes & more</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* ── About ─────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>About</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bioText}>{CURRENT_USER.bio}</Text>
        </View>

        {/* ── Sports ────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sports</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.sportsRow}>
            {CURRENT_USER.sports.map((sport) => (
              <SportBadge key={sport.id} sport={sport} size="lg" variant="filled" />
            ))}
          </View>
          <View style={styles.skillBadge}>
            <MaterialCommunityIcons name="trending-up" size={14} color={Colors.primaryDark} />
            <Text style={styles.skillText}>{CURRENT_USER.skillLevel} Level</Text>
          </View>
        </View>

        {/* ── Availability ──────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Availability</Text>
          <View style={styles.daysRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
              const active = CURRENT_USER.availability.days.includes(day);
              return (
                <View key={day} style={[styles.dayChip, active && styles.dayChipActive]}>
                  <Text style={[styles.dayText, active && styles.dayTextActive]}>{day}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.timeSlotsRow}>
            {CURRENT_USER.availability.timeSlots.map((slot) => (
              <View key={slot} style={styles.timeSlot}>
                <Text style={styles.timeSlotText}>{slot}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick Settings ────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Settings</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Ionicons name="notifications-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.toggleLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notifications ? Colors.primary : Colors.textMuted}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
              <Ionicons name="eye-outline" size={18} color={Colors.textSecondary} />
              <Text style={styles.toggleLabel}>Discoverable</Text>
            </View>
            <Switch
              value={discoverable}
              onValueChange={setDiscoverable}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={discoverable ? Colors.primary : Colors.textMuted}
            />
          </View>
        </View>

        {/* ── Logout ────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={Colors.accent} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Sportli v1.0.0</Text>
      </ScrollView>

      {/* ── "..." Menu Sheet ──────────────────────────── */}
      <Modal visible={showMenu} transparent animationType="slide" onRequestClose={() => setShowMenu(false)}>
        <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={() => setShowMenu(false)} />
        <View style={styles.menuSheet}>
          <View style={styles.menuHandle} />

          {[
            { icon: 'create-outline', label: 'Edit Profile', action: () => { setShowMenu(false); navigation.navigate('EditProfile'); } },
            { icon: 'settings-outline', label: 'Settings', action: () => { setShowMenu(false); navigation.navigate('Settings'); } },
            { icon: 'share-social-outline', label: 'Share Profile', action: () => setShowMenu(false) },
            { icon: 'star-outline', label: 'Rate Sportli', action: () => setShowMenu(false) },
            { icon: 'help-circle-outline', label: 'Help & Support', action: () => setShowMenu(false) },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.action} activeOpacity={0.7}>
                <View style={styles.menuItemIcon}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}

          <TouchableOpacity style={styles.menuCancelBtn} onPress={() => setShowMenu(false)}>
            <Text style={styles.menuCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 100 },

  // Hero
  hero: {
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.base,
  },
  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 46,
    paddingHorizontal: Spacing['2xl'],
  },
  heroScreenTitle: { ...Typography.h3, color: Colors.white },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarArea: { position: 'relative', marginTop: Spacing.base },
  avatarRing: {
    width: 106,
    height: 106,
    borderRadius: 53,
    padding: 3,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nameArea: { alignItems: 'center', gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  userName: { ...Typography.h2, color: Colors.white, fontWeight: '700' },
  locationText: { ...Typography.body, color: 'rgba(255,255,255,0.72)' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
    marginHorizontal: Spacing['2xl'],
    gap: Spacing['2xl'],
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { ...Typography.h2, color: Colors.white, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.65)' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editProfileText: { ...Typography.label, color: Colors.white, fontWeight: '600' },

  // Premium card
  premiumCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  premiumText: { flex: 1 },
  premiumTitle: { ...Typography.h4, color: Colors.white },
  premiumSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.78)' },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { ...Typography.h4, color: Colors.textPrimary },
  bioText: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  skillText: { ...Typography.label, color: Colors.primaryDark },
  daysRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
  dayChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  dayTextActive: { color: Colors.white },
  timeSlotsRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  timeSlot: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  timeSlotText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleLabel: { ...Typography.body, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  logoutText: { ...Typography.labelLarge, color: Colors.accent },
  version: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', marginTop: Spacing.lg },

  // Menu sheet
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.42)' },
  menuSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['3xl'],
    borderTopRightRadius: BorderRadius['3xl'],
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 38 : Spacing['2xl'],
    ...Shadow.lg,
  },
  menuHandle: {
    width: 38,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.base,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    paddingVertical: Spacing.base,
  },
  menuItemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: { flex: 1, ...Typography.body, color: Colors.textPrimary },
  menuCancelBtn: {
    marginTop: Spacing.base,
    alignItems: 'center',
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
  },
  menuCancelText: { ...Typography.labelLarge, color: Colors.textSecondary },
});
