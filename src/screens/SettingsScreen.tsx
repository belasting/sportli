import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { useTheme } from '../context/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const [matchNotif, setMatchNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);
  const [groupNotif, setGroupNotif] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );

  const SettingRow = ({
    icon,
    label,
    sublabel,
    value,
    onToggle,
    onPress,
    chevron,
    danger,
  }: {
    icon: string;
    label: string;
    sublabel?: string;
    value?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void;
    chevron?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !onToggle}
    >
      <View style={[styles.iconWrap, danger && styles.iconWrapDanger, !danger && { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon as any} size={18} color={danger ? colors.accent : colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: danger ? colors.accent : colors.textPrimary }]}>{label}</Text>
        {sublabel && <Text style={[styles.rowSublabel, { color: colors.textMuted }]}>{sublabel}</Text>}
      </View>
      {onToggle !== undefined && value !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={value ? colors.primary : colors.textMuted}
        />
      ) : chevron ? (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );

  const Divider = () => <View style={[styles.divider, { backgroundColor: colors.border }]} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Section title="Appearance">
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            sublabel="Switch to dark theme"
            value={isDark}
            onToggle={toggleTheme}
          />
        </Section>

        <Section title="Notifications">
          <SettingRow
            icon="heart-outline"
            label="New Matches"
            sublabel="Get notified when you match"
            value={matchNotif}
            onToggle={setMatchNotif}
          />
          <Divider />
          <SettingRow
            icon="chatbubble-outline"
            label="Messages"
            sublabel="Get notified for new messages"
            value={messageNotif}
            onToggle={setMessageNotif}
          />
          <Divider />
          <SettingRow
            icon="people-outline"
            label="Group Activity"
            sublabel="Group chat notifications"
            value={groupNotif}
            onToggle={setGroupNotif}
          />
        </Section>

        <Section title="Privacy">
          <SettingRow
            icon="location-outline"
            label="Location Sharing"
            sublabel="Show your approximate location"
            value={locationSharing}
            onToggle={setLocationSharing}
          />
          <Divider />
          <SettingRow
            icon="eye-outline"
            label="Read Receipts"
            sublabel="Let others see when you've read"
            value={readReceipts}
            onToggle={setReadReceipts}
          />
          <Divider />
          <SettingRow
            icon="navigate-circle-outline"
            label="Show Distance"
            value={showDistance}
            onToggle={setShowDistance}
          />
          <Divider />
          <SettingRow
            icon="calendar-outline"
            label="Show Age"
            value={showAge}
            onToggle={setShowAge}
          />
        </Section>

        <Section title="Discovery">
          <SettingRow
            icon="search-outline"
            label="Discovery Preferences"
            sublabel="Who can find you"
            chevron
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="ban-outline"
            label="Blocked Users"
            sublabel="Manage blocked accounts"
            chevron
            onPress={() => {}}
          />
        </Section>

        <Section title="Account">
          <SettingRow
            icon="mail-outline"
            label="Change Email"
            chevron
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="lock-closed-outline"
            label="Change Password"
            chevron
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="shield-checkmark-outline"
            label="Verify Account"
            sublabel="Get a verified badge"
            chevron
            onPress={() => {}}
          />
        </Section>

        <Section title="Support">
          <SettingRow
            icon="help-circle-outline"
            label="Help & Support"
            chevron
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="star-outline"
            label="Rate Sportli"
            chevron
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="document-text-outline"
            label="Terms & Privacy"
            chevron
            onPress={() => {}}
          />
        </Section>

        <Section title="Danger Zone">
          <SettingRow
            icon="pause-circle-outline"
            label="Pause Account"
            sublabel="Temporarily hide your profile"
            chevron
            danger
            onPress={() => {}}
          />
          <Divider />
          <SettingRow
            icon="trash-outline"
            label="Delete Account"
            sublabel="This action is permanent"
            chevron
            danger
            onPress={() => {}}
          />
        </Section>

        <Text style={[styles.version, { color: colors.textMuted }]}>Sportli v1.0.0</Text>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  scroll: { padding: Spacing.base, paddingBottom: 80 },
  section: { marginBottom: Spacing.base },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.base,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDanger: { backgroundColor: '#FFF0F0' },
  rowContent: { flex: 1 },
  rowLabel: { ...Typography.body, color: Colors.textPrimary },
  rowLabelDanger: { color: Colors.accent },
  rowSublabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.base + 36 + Spacing.base },
  version: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
});
