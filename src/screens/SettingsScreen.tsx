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
import { SportliLogo } from '../components/SportliLogo';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

type SettingToggle = { id: string; label: string; sub?: string; icon: string; iconBg: string; value: boolean };
type SettingNav = { label: string; sub?: string; icon: string; iconBg: string; onPress: () => void };

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { isDark, toggleTheme, colors } = useTheme();
  const darkMode = isDark;
  const [notifications, setNotifications] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [locationAlways, setLocationAlways] = useState(false);
  const [discoverable, setDiscoverable] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [showAge, setShowAge] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  const toggleSections: {
    title: string;
    items: SettingToggle[];
  }[] = [
    {
      title: 'Appearance',
      items: [
        { id: 'darkMode', label: 'Dark Mode', sub: 'Easier on the eyes at night', icon: 'moon', iconBg: '#3A3A5C', value: darkMode },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { id: 'notifications', label: 'Push Notifications', sub: 'Allow all notifications', icon: 'notifications-outline', iconBg: Colors.primary, value: notifications },
        { id: 'matchAlerts', label: 'New Matches', sub: 'When someone likes you back', icon: 'heart-outline', iconBg: Colors.accent, value: matchAlerts },
        { id: 'messageAlerts', label: 'New Messages', sub: 'In chats and groups', icon: 'chatbubble-outline', iconBg: Colors.success, value: messageAlerts },
      ],
    },
    {
      title: 'Privacy',
      items: [
        { id: 'discoverable', label: 'Discoverable', sub: 'Others can find your profile', icon: 'eye-outline', iconBg: Colors.secondary, value: discoverable },
        { id: 'showDistance', label: 'Show Distance', sub: 'Visible to matches', icon: 'location-outline', iconBg: '#9B59B6', value: showDistance },
        { id: 'showAge', label: 'Show Age', sub: 'Visible on your profile', icon: 'calendar-outline', iconBg: Colors.primaryDark, value: showAge },
        { id: 'readReceipts', label: 'Read Receipts', sub: 'Let others know you\'ve read', icon: 'checkmark-done-outline', iconBg: Colors.success, value: readReceipts },
      ],
    },
    {
      title: 'Location',
      items: [
        { id: 'locationAlways', label: 'Precise Location', sub: 'Improves nearby matches', icon: 'navigate-outline', iconBg: Colors.primary, value: locationAlways },
      ],
    },
  ];

  const toggleHandlers: Record<string, (v: boolean) => void> = {
    darkMode: () => toggleTheme(),
    notifications: setNotifications,
    matchAlerts: setMatchAlerts,
    messageAlerts: setMessageAlerts,
    discoverable: setDiscoverable,
    showDistance: setShowDistance,
    showAge: setShowAge,
    readReceipts: setReadReceipts,
    locationAlways: setLocationAlways,
  };

  const navItems: { title: string; items: SettingNav[] }[] = [
    {
      title: 'Account',
      items: [
        { label: 'Edit Profile', sub: 'Update your info & photos', icon: 'person-outline', iconBg: Colors.primary, onPress: () => navigation.navigate('EditProfile') },
        { label: 'Change Password', icon: 'lock-closed-outline', iconBg: '#E74C3C', onPress: () => {} },
        { label: 'Blocked Users', icon: 'ban-outline', iconBg: Colors.textMuted, onPress: () => {} },
        { label: 'Delete Account', icon: 'trash-outline', iconBg: Colors.accent, onPress: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', icon: 'help-circle-outline', iconBg: Colors.secondary, onPress: () => {} },
        { label: 'Report a Problem', icon: 'bug-outline', iconBg: '#E74C3C', onPress: () => {} },
        { label: 'Rate Sportli', icon: 'star-outline', iconBg: '#FFD700', onPress: () => {} },
        { label: 'Terms & Privacy', icon: 'document-text-outline', iconBg: Colors.textMuted, onPress: () => {} },
      ],
    },
  ];

  const bg = isDark ? '#000' : Colors.background;
  const cardBg = isDark ? '#1C1C1E' : Colors.white;
  const borderColor = isDark ? '#38383A' : Colors.border;
  const textPrimary = isDark ? '#fff' : Colors.textPrimary;
  const textMuted = isDark ? '#8E8E93' : Colors.textMuted;

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1C1C1E' : Colors.white, borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: isDark ? '#2C2C2E' : Colors.surfaceAlt }]}>
          <Ionicons name="arrow-back" size={22} color={textPrimary} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <SportliLogo size={26} />
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Settings</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Toggle sections */}
        {toggleSections.map((section) => (
          <View key={section.title} style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: textMuted }]}>{section.title}</Text>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              {section.items.map((item, i) => (
                <React.Fragment key={item.id}>
                  <View style={styles.settingRow}>
                    <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon as any} size={17} color={Colors.white} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: textPrimary }]}>{item.label}</Text>
                      {item.sub && <Text style={[styles.settingSub, { color: textMuted }]}>{item.sub}</Text>}
                    </View>
                    <Switch
                      value={item.value}
                      onValueChange={toggleHandlers[item.id]}
                      trackColor={{ false: borderColor, true: Colors.primary }}
                      thumbColor="#fff"
                      ios_backgroundColor={borderColor}
                    />
                  </View>
                  {i < section.items.length - 1 && <View style={[styles.divider, { backgroundColor: borderColor, marginLeft: 58 }]} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Nav sections */}
        {navItems.map((section) => (
          <View key={section.title} style={styles.sectionBlock}>
            <Text style={[styles.sectionLabel, { color: textMuted }]}>{section.title}</Text>
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              {section.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <TouchableOpacity style={styles.settingRow} onPress={item.onPress} activeOpacity={0.7}>
                    <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                      <Ionicons name={item.icon as any} size={17} color={Colors.white} />
                    </View>
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: textPrimary }]}>{item.label}</Text>
                      {item.sub && <Text style={[styles.settingSub, { color: textMuted }]}>{item.sub}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={textMuted} />
                  </TouchableOpacity>
                  {i < section.items.length - 1 && <View style={[styles.divider, { backgroundColor: borderColor, marginLeft: 58 }]} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.versionText}>Sportli v1.0.0 · Made with ❤️</Text>
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
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: 100,
    gap: Spacing.base,
  },
  sectionBlock: { gap: Spacing.sm },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: { flex: 1, gap: 1 },
  settingLabel: { ...Typography.body, color: Colors.textPrimary },
  settingSub: { ...Typography.caption, color: Colors.textMuted },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 62 },
  versionText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
