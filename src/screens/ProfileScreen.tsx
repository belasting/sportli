import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { CURRENT_USER } from '../data/mockUsers';
import { SportBadge } from '../components/SportBadge';
import { Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { RootStackParamList } from '../types';
import { useTheme } from '../context/ThemeContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Animated counter stat card ────────────────────────────────────────────────
const StatCard: React.FC<{
  target: number;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  textColor: string;
  mutedColor: string;
}> = ({ target, label, icon, iconColor, bgColor, textColor, mutedColor }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [count, setCount] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 1100,
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => setCount(Math.round(value)));
    return () => anim.removeListener(id);
  }, [target]);

  return (
    <View style={[sc.card, { backgroundColor: bgColor }]}>
      <View style={[sc.iconRing, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={17} color={iconColor} />
      </View>
      <Text style={[sc.count, { color: textColor }]}>{count}</Text>
      <Text style={[sc.label, { color: mutedColor }]}>{label}</Text>
    </View>
  );
};

const sc = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  iconRing: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  count: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  label: { fontSize: 11, fontWeight: '500', letterSpacing: 0.1 },
});

// ── iOS-style section card ────────────────────────────────────────────────────
const SectionCard: React.FC<{
  children: React.ReactNode;
  bg: string;
}> = ({ children, bg }) => (
  <View style={[card.wrap, { backgroundColor: bg }]}>{children}</View>
);

const card = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    marginHorizontal: Spacing.base,
    marginBottom: 10,
    overflow: 'hidden',
    ...Shadow.sm,
  },
});

// ── Main screen ───────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { isDark, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const menuAnim = useRef(new Animated.Value(400)).current;

  const openMenu = () => {
    setShowMenu(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(menuAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 11 }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, { toValue: 400, duration: 220, useNativeDriver: true }).start(() =>
      setShowMenu(false)
    );
  };

  const bg = isDark ? '#000000' : '#F2F2F7'; // iOS-exact backgrounds

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: bg }}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" />

        {/* ── Hero ─────────────────────────────────────── */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['#0A1628', '#0E2A4A', '#0288D1']}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top bar */}
          <View style={styles.heroTopBar}>
            <Text style={styles.heroTitle}>My Profile</Text>
            <TouchableOpacity style={styles.menuBtn} onPress={openMenu} activeOpacity={0.75}>
              <Ionicons name="ellipsis-horizontal" size={20} color="rgba(255,255,255,0.95)" />
            </TouchableOpacity>
          </View>

          {/* Avatar with gradient ring */}
          <View style={styles.avatarWrap}>
            <LinearGradient
              colors={['#4FC3F7', '#FF5252', '#FF9800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <Image source={{ uri: CURRENT_USER.photos[0] }} style={styles.avatar} />
            </LinearGradient>
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Name + location */}
          <View style={styles.nameBlock}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{CURRENT_USER.name}</Text>
              {CURRENT_USER.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color="#4FC3F7" />
              )}
              {CURRENT_USER.isPremium && (
                <MaterialCommunityIcons name="crown" size={16} color={colors.secondary} />
              )}
            </View>
            <Text style={styles.locationText}>📍 {CURRENT_USER.location}</Text>
          </View>

          {/* Animated stat cards */}
          <View style={styles.statsRow}>
            <StatCard
              target={47}
              label="Likes"
              icon="heart"
              iconColor="#FF5252"
              bgColor={isDark ? 'rgba(255,82,82,0.15)' : 'rgba(255,82,82,0.12)'}
              textColor="#fff"
              mutedColor="rgba(255,255,255,0.65)"
            />
            <StatCard
              target={12}
              label="Matches"
              icon="people"
              iconColor="#4FC3F7"
              bgColor={isDark ? 'rgba(79,195,247,0.15)' : 'rgba(79,195,247,0.14)'}
              textColor="#fff"
              mutedColor="rgba(255,255,255,0.65)"
            />
            <StatCard
              target={8}
              label="Meetups"
              icon="trophy"
              iconColor="#FF9800"
              bgColor={isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.13)'}
              textColor="#fff"
              mutedColor="rgba(255,255,255,0.65)"
            />
          </View>

          {/* Edit Profile button */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={15} color="#fff" />
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Premium banner ────────────────────────────── */}
        <TouchableOpacity
          style={[styles.premiumCard, { marginHorizontal: Spacing.base, marginTop: 14, marginBottom: 10 }]}
          onPress={() => navigation.navigate('Premium')}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={['#FF9800', '#FF5722']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Decorative glow blob */}
          <View style={styles.premiumGlow} />
          <MaterialCommunityIcons name="crown" size={22} color="#FFD700" />
          <View style={styles.premiumTextBlock}>
            <Text style={styles.premiumTitle}>Upgrade to Sportli+</Text>
            <Text style={styles.premiumSub}>Unlimited likes · See who liked you</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* ── About ──────────────────────────────────────── */}
        <SectionCard bg={isDark ? '#1C1C1E' : '#fff'}>
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>About</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Ionicons name="create-outline" size={17} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>{CURRENT_USER.bio}</Text>
          </View>
        </SectionCard>

        {/* ── Sports ─────────────────────────────────────── */}
        <SectionCard bg={isDark ? '#1C1C1E' : '#fff'}>
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sports</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                <Ionicons name="add-circle-outline" size={19} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.sportsWrap}>
              {CURRENT_USER.sports.map((sport) => (
                <SportBadge key={sport.id} sport={sport} size="lg" variant="filled" />
              ))}
            </View>
            <View style={[styles.skillPill, { backgroundColor: colors.primaryLight }]}>
              <MaterialCommunityIcons name="trending-up" size={13} color={colors.primaryDark} />
              <Text style={[styles.skillText, { color: colors.primaryDark }]}>
                {CURRENT_USER.skillLevel} Level
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* ── Availability ────────────────────────────────── */}
        <SectionCard bg={isDark ? '#1C1C1E' : '#fff'}>
          <View style={styles.cardInner}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Availability</Text>
            <View style={styles.daysRow}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const active = CURRENT_USER.availability.days.includes(day);
                return (
                  <View
                    key={day}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: active ? '#4FC3F7' : colors.surfaceAlt,
                        borderColor: active ? '#4FC3F7' : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: active ? '#fff' : colors.textMuted },
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.timeRow}>
              {CURRENT_USER.availability.timeSlots.map((slot) => (
                <View key={slot} style={[styles.timeChip, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.timeChipText, { color: colors.primaryDark }]}>{slot}</Text>
                </View>
              ))}
            </View>
          </View>
        </SectionCard>

        {/* ── Quick Settings ──────────────────────────────── */}
        <SectionCard bg={isDark ? '#1C1C1E' : '#fff'}>
          {/* Notifications toggle */}
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => {
              setNotifications((v) => !v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.primary }]}>
              <Ionicons name="notifications" size={15} color="#fff" />
            </View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={(v) => { setNotifications(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor={colors.border}
            />
          </TouchableOpacity>

          <View style={[styles.rowSep, { marginLeft: 54, backgroundColor: colors.border }]} />

          {/* Discoverable toggle */}
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => {
              setDiscoverable((v) => !v);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#9B59B6' }]}>
              <Ionicons name="eye" size={15} color="#fff" />
            </View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Discoverable</Text>
            <Switch
              value={discoverable}
              onValueChange={(v) => { setDiscoverable(v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
              trackColor={{ false: colors.border, true: '#9B59B6' }}
              thumbColor="#fff"
              ios_backgroundColor={colors.border}
            />
          </TouchableOpacity>

          <View style={[styles.rowSep, { marginLeft: 54, backgroundColor: colors.border }]} />

          {/* All Settings nav row */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <View style={[styles.settingIcon, { backgroundColor: '#3A3A5C' }]}>
              <Ionicons name="settings" size={15} color="#fff" />
            </View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>All Settings</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </SectionCard>

        {/* ── Logout ─────────────────────────────────────── */}
        <SectionCard bg={isDark ? '#1C1C1E' : '#fff'}>
          <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={17} color={colors.accent} />
            <Text style={[styles.logoutText, { color: colors.accent }]}>Log Out</Text>
          </TouchableOpacity>
        </SectionCard>

        <Text style={[styles.version, { color: colors.textMuted }]}>Sportli v1.0.0 · Made with ❤️</Text>
      </ScrollView>

      {/* ── "..." Menu Sheet ──────────────────────────────── */}
      <Modal visible={showMenu} transparent animationType="none" onRequestClose={closeMenu}>
        <TouchableOpacity
          style={styles.menuBackdrop}
          activeOpacity={1}
          onPress={closeMenu}
        />
        <Animated.View
          style={[
            styles.menuSheet,
            { backgroundColor: isDark ? '#1C1C1E' : '#fff', transform: [{ translateY: menuAnim }] },
          ]}
        >
          <View style={[styles.menuHandle, { backgroundColor: isDark ? '#48484A' : '#D1D1D6' }]} />

          {[
            {
              icon: 'create-outline' as const,
              label: 'Edit Profile',
              iconBg: '#4FC3F7',
              action: () => { closeMenu(); setTimeout(() => navigation.navigate('EditProfile'), 250); },
            },
            {
              icon: 'settings-outline' as const,
              label: 'Settings',
              iconBg: '#3A3A5C',
              action: () => { closeMenu(); setTimeout(() => navigation.navigate('Settings'), 250); },
            },
            {
              icon: 'share-social-outline' as const,
              label: 'Share Profile',
              iconBg: '#30D158',
              action: closeMenu,
            },
            {
              icon: 'star-outline' as const,
              label: 'Rate Sportli',
              iconBg: '#FF9800',
              action: closeMenu,
            },
            {
              icon: 'help-circle-outline' as const,
              label: 'Help & Support',
              iconBg: '#5856D6',
              action: closeMenu,
            },
          ].map((item, i, arr) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.action} activeOpacity={0.7}>
                <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={17} color="#fff" />
                </View>
                <Text style={[styles.menuItemText, { color: isDark ? '#fff' : '#1A1A2E' }]}>
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={15} color={isDark ? '#636366' : '#C7C7CC'} />
              </TouchableOpacity>
              {i < arr.length - 1 && (
                <View
                  style={[styles.menuSep, { marginLeft: 58, backgroundColor: isDark ? '#38383A' : '#E5E7EB' }]}
                />
              )}
            </React.Fragment>
          ))}

          <TouchableOpacity
            style={[styles.menuCancel, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
            onPress={closeMenu}
            activeOpacity={0.7}
          >
            <Text style={[styles.menuCancelText, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Hero
  hero: {
    alignItems: 'center',
    gap: 14,
    paddingBottom: 28,
  },
  heroTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingHorizontal: 24,
  },
  heroTitle: { ...Typography.h3, color: '#fff', fontWeight: '700' },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Avatar
  avatarWrap: { position: 'relative', marginTop: 4 },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: { width: 104, height: 104, borderRadius: 52 },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4FC3F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
  },

  // Name
  nameBlock: { alignItems: 'center', gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { ...Typography.h2, color: '#fff', fontWeight: '800' },
  locationText: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.72)' },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    width: '100%',
  },

  // Edit button
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
  },
  editBtnText: { ...Typography.label, color: '#fff', fontWeight: '600' },

  // Premium card
  premiumCard: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    ...Shadow.md,
  },
  premiumGlow: {
    position: 'absolute',
    top: -30,
    right: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  premiumTextBlock: { flex: 1 },
  premiumTitle: { ...Typography.h4, color: '#fff' },
  premiumSub: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.78)', marginTop: 1 },

  // Cards
  cardInner: {
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: { ...Typography.h4, fontWeight: '700' },
  bioText: { ...Typography.body, lineHeight: 22 },
  sportsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  skillText: { ...Typography.label, fontWeight: '600' },
  daysRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap' },
  dayChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  dayText: { ...Typography.caption, fontWeight: '700' },
  timeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  timeChip: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  timeChipText: { ...Typography.caption, fontWeight: '600' },

  // Settings rows (iOS UITableView style)
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  settingIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { flex: 1, ...Typography.body, fontWeight: '400' },
  rowSep: { height: StyleSheet.hairlineWidth },

  // Logout
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
  },
  logoutText: { ...Typography.labelLarge, fontWeight: '600' },

  version: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },

  // Menu sheet
  menuBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.48)' },
  menuSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    ...Shadow.lg,
  },
  menuHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: { flex: 1, ...Typography.body, fontWeight: '400' },
  menuSep: { height: StyleSheet.hairlineWidth },
  menuCancel: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  menuCancelText: { ...Typography.labelLarge, fontWeight: '600' },
});
