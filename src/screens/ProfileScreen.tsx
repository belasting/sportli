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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CURRENT_USER } from '../data/mockUsers';
import { SportBadge } from '../components/SportBadge';
import { AnimatedButton } from '../components/AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { RootStackParamList } from '../types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'person-outline', label: 'Edit Profile', chevron: true },
      { icon: 'notifications-outline', label: 'Notifications', chevron: true },
      { icon: 'shield-checkmark-outline', label: 'Privacy & Safety', chevron: true },
      { icon: 'location-outline', label: 'Location Settings', chevron: true },
    ],
  },
  {
    title: 'Discovery',
    items: [
      { icon: 'people-outline', label: 'Who Can See Me', chevron: true },
      { icon: 'search-outline', label: 'Discovery Preferences', chevron: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help & Support', chevron: true },
      { icon: 'star-outline', label: 'Rate Sportli', chevron: true },
      { icon: 'document-text-outline', label: 'Terms & Privacy', chevron: true },
    ],
  },
];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [notifications, setNotifications] = useState(true);
  const [discoverable, setDiscoverable] = useState(true);

  const stats = [
    { value: '47', label: 'Likes Given', icon: 'heart' as const },
    { value: '12', label: 'Matches', icon: 'people' as const },
    { value: '8', label: 'Meetups', icon: 'trophy' as const },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      {/* Hero section */}
      <View style={styles.hero}>
        <LinearGradient
          colors={['#0f3460', Colors.primaryDark, Colors.primary]}
          style={styles.heroBg}
        />

        <View style={styles.heroContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: CURRENT_USER.photos[0] }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.heroInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{CURRENT_USER.name}</Text>
              {CURRENT_USER.isVerified && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.primaryLight} />
              )}
            </View>
            <Text style={styles.location}>
              📍 {CURRENT_USER.location}
            </Text>
          </View>

          <AnimatedButton
            label="Edit Profile"
            onPress={() => {}}
            variant="outline"
            size="sm"
            style={{ borderColor: 'rgba(255,255,255,0.5)' }}
            textStyle={{ color: Colors.white }}
            icon={<Ionicons name="create-outline" size={14} color={Colors.white} />}
          />
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

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
          <MaterialCommunityIcons name="crown" size={28} color={Colors.white} />
          <View style={styles.premiumText}>
            <Text style={styles.premiumTitle}>Upgrade to Sportli+</Text>
            <Text style={styles.premiumSubtitle}>Unlimited swipes, see who liked you & more</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color={Colors.white} />
        </View>
      </TouchableOpacity>

      {/* Bio section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.bio}>{CURRENT_USER.bio}</Text>
      </View>

      {/* Sports section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sports</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.sportsRow}>
          {CURRENT_USER.sports.map((sport) => (
            <SportBadge key={sport.id} sport={sport} size="lg" variant="filled" />
          ))}
        </View>
        <View style={styles.skillBadge}>
          <MaterialCommunityIcons name="trending-up" size={16} color={Colors.primaryDark} />
          <Text style={styles.skillText}>{CURRENT_USER.skillLevel} Level</Text>
        </View>
      </View>

      {/* Availability section */}
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

      {/* Settings sections */}
      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.settingsList}>
            {section.items.map((item, i) => (
              <React.Fragment key={item.label}>
                <TouchableOpacity style={styles.settingItem}>
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={item.icon as any} size={18} color={Colors.primary} />
                    </View>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
                {i < section.items.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color={Colors.accent} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Sportli v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 100 },

  // Hero
  hero: {
    backgroundColor: Colors.primaryDark,
    paddingBottom: Spacing['2xl'],
    marginBottom: Spacing.base,
  },
  heroBg: { ...StyleSheet.absoluteFillObject },
  heroContent: {
    paddingTop: Platform.OS === 'ios' ? 64 : 50,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.base,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  heroInfo: { alignItems: 'center', gap: Spacing.xs },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  userName: { ...Typography.h2, color: Colors.white },
  location: { ...Typography.body, color: 'rgba(255,255,255,0.75)' },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing['2xl'],
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { ...Typography.h2, color: Colors.white },
  statLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },

  // Premium card
  premiumCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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

  // Availability
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

  // Toggles
  toggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  toggleLabel: { ...Typography.body, color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border },

  // Settings
  settingsList: { gap: 0 },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
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
  version: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
