import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  TextInput,
  Modal,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, GroupChat } from '../types';
import { SPORTS } from '../data/sports';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { SportliLogo } from '../components/SportliLogo';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const MOCK_GROUPS: GroupChat[] = [
  {
    id: 'g1',
    name: 'NYC Basketball Crew',
    sport: SPORTS[0],
    coverPhoto: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
    members: [
      { id: '1', name: 'Alex Rivera', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'] },
      { id: '2', name: 'Mia Chen', photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80'] },
      { id: 'me', name: 'Sam Parker', photos: ['https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&q=80'] },
      { id: '3', name: 'Jordan Hayes', photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80'] },
    ],
    messages: [],
    lastMessage: {
      id: 'm1',
      senderId: '1',
      senderName: 'Alex',
      senderPhoto: '',
      text: 'Anyone down for a pickup game Saturday morning? 🏀',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    unreadCount: 3,
  },
  {
    id: 'g2',
    name: 'Sunday Runners Club',
    sport: SPORTS[4],
    coverPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    members: [
      { id: '3', name: 'Jordan Hayes', photos: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80'] },
      { id: '6', name: 'Priya Sharma', photos: ['https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=200&q=80'] },
      { id: 'me', name: 'Sam Parker', photos: ['https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&q=80'] },
    ],
    messages: [],
    lastMessage: {
      id: 'm2',
      senderId: '3',
      senderName: 'Jordan',
      senderPhoto: '',
      text: 'Meeting at Central Park entrance at 7am!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    unreadCount: 1,
  },
  {
    id: 'g3',
    name: 'Tennis Partners NYC',
    sport: SPORTS[2],
    coverPhoto: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&q=80',
    members: [
      { id: '2', name: 'Mia Chen', photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80'] },
      { id: '7', name: 'Tyler Brooks', photos: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80'] },
      { id: 'me', name: 'Sam Parker', photos: ['https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&q=80'] },
    ],
    messages: [],
    lastMessage: {
      id: 'm3',
      senderId: '2',
      senderName: 'Mia',
      senderPhoto: '',
      text: 'Courts are free tomorrow evening if anyone wants to play',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    unreadCount: 0,
  },
  {
    id: 'g4',
    name: 'Yoga & Wellness Collective',
    sport: SPORTS[7],
    coverPhoto: 'https://images.unsplash.com/photo-1599447292325-3bc1e51f8bca?w=600&q=80',
    members: [
      { id: '6', name: 'Priya Sharma', photos: ['https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=200&q=80'] },
      { id: '4', name: 'Sofia Martins', photos: ['https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=80'] },
      { id: 'me', name: 'Sam Parker', photos: ['https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&q=80'] },
    ],
    messages: [],
    lastMessage: {
      id: 'm4',
      senderId: '6',
      senderName: 'Priya',
      senderPhoto: '',
      text: 'New session posted for Thursday at 6am 🧘',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    unreadCount: 0,
  },
];

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
};

export const GroupChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState<GroupChat[]>(MOCK_GROUPS);

  // Create group modal — now supports multi-sport selection
  const [createVisible, setCreateVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSports, setNewGroupSports] = useState<string[]>([]);
  const sheetAnim = useRef(new Animated.Value(500)).current;

  const openCreate = () => {
    setCreateVisible(true);
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 11,
    }).start();
  };

  const closeCreate = () => {
    Animated.timing(sheetAnim, {
      toValue: 500,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setCreateVisible(false);
      setNewGroupName('');
      setNewGroupSports([]);
    });
  };

  const toggleNewSport = (id: string) => {
    setNewGroupSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!newGroupName.trim()) return;
    // Use first selected sport as primary (or Basketball as fallback)
    const primarySportId = newGroupSports[0];
    const sport = SPORTS.find((s) => s.id === primarySportId) ?? SPORTS[0];
    const newGroup: GroupChat = {
      id: `g${Date.now()}`,
      name: newGroupName.trim(),
      sport,
      members: [
        { id: 'me', name: 'Sam Parker', photos: ['https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&q=80'] },
      ],
      messages: [],
      unreadCount: 0,
    };
    setGroups((prev) => [newGroup, ...prev]);
    closeCreate();
  };

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = groups.reduce((acc, g) => acc + g.unreadCount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SportliLogo size={30} />
          <View>
            <Text style={styles.headerTitle}>Groups</Text>
            {totalUnread > 0 && (
              <Text style={styles.headerSubtitle}>{totalUnread} new messages</Text>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.createBtn} activeOpacity={0.8} onPress={openCreate}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.createBtnGradient}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {/* Discover Banner */}
        <TouchableOpacity style={styles.discoverBanner} activeOpacity={0.9}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.discoverContent}>
            <MaterialCommunityIcons name="compass" size={28} color={Colors.white} />
            <View style={styles.discoverText}>
              <Text style={styles.discoverTitle}>Discover Groups</Text>
              <Text style={styles.discoverSubtitle}>Find sport communities near you</Text>
            </View>
          </View>
          <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>

        {/* Section title */}
        <Text style={styles.sectionTitle}>Your Groups</Text>

        {/* Group list */}
        {filtered.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            activeOpacity={0.75}
            onPress={() => navigation.navigate('GroupChatConversation', { group })}
          >
            {/* Cover photo / sport badge */}
            <View style={styles.groupAvatar}>
              {group.coverPhoto ? (
                <Image source={{ uri: group.coverPhoto }} style={styles.coverPhoto} />
              ) : (
                <View style={[styles.coverPhoto, styles.coverPhotoFallback]}>
                  <Text style={styles.coverPhotoEmoji}>{group.sport.emoji}</Text>
                </View>
              )}
              <View style={styles.sportBadge}>
                <Text style={styles.sportBadgeEmoji}>{group.sport.emoji}</Text>
              </View>
            </View>

            {/* Info */}
            <View style={styles.groupInfo}>
              <View style={styles.groupTopRow}>
                <Text style={styles.groupName} numberOfLines={1}>
                  {group.name}
                </Text>
                <Text style={styles.groupTime}>
                  {group.lastMessage ? formatTime(group.lastMessage.timestamp) : ''}
                </Text>
              </View>
              <View style={styles.groupBottomRow}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {group.lastMessage
                    ? `${group.lastMessage.senderName}: ${group.lastMessage.text}`
                    : 'No messages yet'}
                </Text>
                {group.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>
                      {group.unreadCount > 9 ? '9+' : group.unreadCount}
                    </Text>
                  </View>
                )}
              </View>

              {/* Members preview */}
              <View style={styles.membersRow}>
                <View style={styles.memberAvatarStack}>
                  {group.members.slice(0, 3).map((member, i) => (
                    <Image
                      key={member.id}
                      source={{ uri: member.photos[0] }}
                      style={[styles.memberAvatar, { marginLeft: i === 0 ? 0 : -8 }]}
                    />
                  ))}
                  {group.members.length > 3 && (
                    <View style={[styles.memberAvatar, styles.memberAvatarMore, { marginLeft: -8 }]}>
                      <Text style={styles.memberAvatarMoreText}>
                        +{group.members.length - 3}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberCount}>
                  {group.members.length} members
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No groups found</Text>
            <Text style={styles.emptySubtitle}>Try a different search or create a new group</Text>
          </View>
        )}
      </ScrollView>

      {/* ── Create Group Sheet ─────────────────────────── */}
      <Modal
        visible={createVisible}
        transparent
        animationType="none"
        onRequestClose={closeCreate}
      >
        <KeyboardAvoidingView
          style={StyleSheet.absoluteFill}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={closeCreate} />
          <Animated.View style={[styles.createSheet, { transform: [{ translateY: sheetAnim }] }]}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Title row */}
            <View style={styles.createSheetHeader}>
              <Text style={styles.createSheetTitle}>Create Group</Text>
              <TouchableOpacity onPress={closeCreate} style={styles.sheetCloseBtn}>
                <Ionicons name="close" size={20} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Group name */}
            <View style={styles.createField}>
              <Text style={styles.createFieldLabel}>Group Name</Text>
              <View style={styles.createFieldInput}>
                <Ionicons name="people-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.createInput}
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  placeholder="e.g. Saturday Soccer Crew"
                  placeholderTextColor={Colors.textMuted}
                  maxLength={40}
                  autoFocus
                />
              </View>
            </View>

            {/* Sport picker — multi-select */}
            <View style={styles.createField}>
              <View style={styles.createFieldLabelRow}>
                <Text style={styles.createFieldLabel}>Sports</Text>
                {newGroupSports.length > 0 && (
                  <Text style={styles.createFieldCount}>{newGroupSports.length} selected</Text>
                )}
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sportScroll}
              >
                {SPORTS.map((sport) => {
                  const active = newGroupSports.includes(sport.id);
                  return (
                    <TouchableOpacity
                      key={sport.id}
                      onPress={() => toggleNewSport(sport.id)}
                      style={[styles.sportChip, active && styles.sportChipActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.sportChipEmoji}>{sport.emoji}</Text>
                      <Text style={[styles.sportChipText, active && styles.sportChipTextActive]}>
                        {sport.name}
                      </Text>
                      {active && <Ionicons name="checkmark-circle" size={13} color={Colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Create button — enabled when name filled (sports optional) */}
            <TouchableOpacity
              onPress={handleCreate}
              activeOpacity={0.85}
              disabled={!newGroupName.trim()}
              style={[styles.createBtn2, !newGroupName.trim() && styles.createBtn2Disabled]}
            >
              <LinearGradient
                colors={newGroupName.trim() ? [Colors.primary, Colors.primaryDark] : [Colors.border, Colors.border]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.createBtn2Grad}
              >
                <Ionicons name="people" size={18} color={Colors.white} />
                <Text style={styles.createBtn2Text}>Create Group</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  headerSubtitle: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  createBtn: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  createBtnGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.base,
    paddingBottom: 100,
    gap: Spacing.sm,
  },
  discoverBanner: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.base,
    ...Shadow.md,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  discoverContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  discoverText: { gap: 2 },
  discoverTitle: { ...Typography.h4, color: Colors.white },
  discoverSubtitle: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.8)' },
  sectionTitle: { ...Typography.label, color: Colors.textMuted, fontWeight: '700', marginBottom: Spacing.xs, letterSpacing: 0.5 },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    position: 'relative',
  },
  coverPhoto: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
  },
  coverPhotoFallback: {
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPhotoEmoji: { fontSize: 28 },
  sportBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sportBadgeEmoji: { fontSize: 12 },
  groupInfo: { flex: 1, gap: Spacing.xs },
  groupTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupName: { ...Typography.labelLarge, color: Colors.textPrimary, flex: 1, marginRight: Spacing.sm },
  groupTime: { ...Typography.caption, color: Colors.textMuted },
  groupBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, marginRight: Spacing.sm },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: { ...Typography.caption, color: Colors.white, fontWeight: '800', fontSize: 10 },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: 2,
  },
  memberAvatarStack: { flexDirection: 'row', alignItems: 'center' },
  memberAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  memberAvatarMore: {
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarMoreText: { fontSize: 8, color: Colors.textSecondary, fontWeight: '700' },
  memberCount: { ...Typography.caption, color: Colors.textMuted },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    gap: Spacing.md,
  },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },

  // Create group sheet
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  createSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing['2xl'],
    ...Shadow.lg,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  createSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  createSheetTitle: { ...Typography.h3, color: Colors.textPrimary },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createField: { gap: Spacing.sm, marginBottom: Spacing.lg },
  createFieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createFieldLabel: { ...Typography.label, color: Colors.textSecondary },
  createFieldCount: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  createFieldInput: {
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
  createInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
    padding: 0,
  },
  sportScroll: { gap: Spacing.sm, paddingVertical: 2 },
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
  sportChipEmoji: { fontSize: 14 },
  sportChipText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },
  sportChipTextActive: { color: Colors.primaryDark },
  createBtn2: { borderRadius: BorderRadius.xl, overflow: 'hidden', ...Shadow.sm },
  createBtn2Disabled: { opacity: 0.5 },
  createBtn2Grad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
  },
  createBtn2Text: { ...Typography.label, color: Colors.white, fontWeight: '700', fontSize: 16 },
});
