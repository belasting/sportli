import React, { useState, useRef } from 'react';
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
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.spring(menuAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() =>
      setMenuVisible(false)
    );
  };

  const menuAction = (action: () => void) => {
    closeMenu();
    setTimeout(action, 200);
  };

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

        {/* Instagram-style header */}
        <LinearGradient
          colors={['#0f3460', Colors.primaryDark, Colors.primary]}
          style={styles.hero}
        >
          {/* 3-dot menu button top-right */}
          <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.white} />
          </TouchableOpacity>

          {/* Centered avatar */}
          <View style={styles.avatarWrap}>
            <Image source={{ uri: CURRENT_USER.photos[0] }} style={styles.avatar} />
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => menuAction(() => navigation.navigate('EditProfile'))}
            >
              <Ionicons name="camera" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Name + verification */}
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{CURRENT_USER.name}</Text>
            {CURRENT_USER.isVerified && (
              <Ionicons name="checkmark-circle" size={18} color="#A5D6FF" />
            )}
          </View>
          <Text style={styles.location}>📍 {CURRENT_USER.location}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {stats.map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && <View style={styles.statDivider} />}
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>

          {/* Edit profile button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="create-outline" size={16} color={Colors.white} />
            <Text style={styles.editProfileBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Premium card */}
        <TouchableOpacity
          style={styles.premiumCard}
          onPress={() => navigation.navigate('Premium')}
        >
          <LinearGradient
            colors={[Colors.secondary, '#FF5722']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.premiumContent}>
            <MaterialCommunityIcons name="crown" size={26} color={Colors.white} />
            <View style={styles.premiumText}>
              <Text style={styles.premiumTitle}>Upgrade to Sportli+</Text>
              <Text style={styles.premiumSubtitle}>Unlimited swipes · See who liked you</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Bio */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
              <Ionicons name="create-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.bio}>{CURRENT_USER.bio}</Text>
        </View>

        {/* Sports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sports</Text>
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

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
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

        {/* Quick toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.toggleLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primaryLight }}
              thumbColor={notifications ? Colors.primary : Colors.textMuted}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.toggleItem}>
            <View style={styles.toggleLeft}>
              <Ionicons name="eye-outline" size={20} color={Colors.textSecondary} />
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

        {/* Settings link */}
        <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Settings')}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <Ionicons name="settings-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.settingLabel}>All Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={Colors.accent} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Sportli v1.0.0</Text>
      </ScrollView>

      {/* 3-dot menu */}
      {menuVisible && (
        <Modal transparent animationType="none" onRequestClose={closeMenu}>
          <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={closeMenu}>
            <Animated.View
              style={[
                styles.menuSheet,
                {
                  opacity: menuAnim,
                  transform: [{ scale: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
                },
              ]}
            >
              {[
                { icon: 'create-outline', label: 'Edit Profile', action: () => navigation.navigate('EditProfile') },
                { icon: 'settings-outline', label: 'Settings', action: () => navigation.navigate('Settings') },
                { icon: 'diamond-outline', label: 'Upgrade to Sportli+', action: () => navigation.navigate('Premium') },
                { icon: 'share-social-outline', label: 'Share Profile', action: () => {} },
                { icon: 'flag-outline', label: 'Report a Problem', action: () => {} },
              ].map((item, i, arr) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => menuAction(item.action)}
                  >
                    <Ionicons name={item.icon as any} size={20} color={Colors.textPrimary} />
                    <Text style={styles.menuItemText}>{item.label}</Text>
                  </TouchableOpacity>
                  {i < arr.length - 1 && <View style={styles.menuDivider} />}
                </React.Fragment>
              ))}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 100 },

  // Hero
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 46,
    paddingBottom: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.sm,
    position: 'relative',
  },
  menuBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 44,
    right: Spacing['2xl'],
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  userName: { ...Typography.h2, color: Colors.white },
  location: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.75)' },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
    gap: 0,
  },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 4 },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { ...Typography.h3, color: Colors.white },
  statLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.7)' },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  editProfileBtnText: { ...Typography.label, color: Colors.white, fontWeight: '600' },

  // Premium
  premiumCard: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadow.md,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.lg,
  },
  premiumText: { flex: 1 },
  premiumTitle: { ...Typography.h4, color: Colors.white },
  premiumSubtitle: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.82)' },

  // Sections
  section: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary },
  bio: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22 },
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

  toggleItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleLabel: { ...Typography.body, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border },

  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { ...Typography.body, color: Colors.textPrimary },

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

  // 3-dot menu
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 100 : 86,
    paddingRight: Spacing['2xl'],
  },
  menuSheet: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    minWidth: 220,
    ...Shadow.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
  },
  menuItemText: { ...Typography.body, color: Colors.textPrimary },
  menuDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.base },
});
