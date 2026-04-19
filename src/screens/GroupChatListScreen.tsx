import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_GROUPS } from '../data/mockGroups';
import { GroupChatType, RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
};

const SPORT_GRADIENTS: Record<string, [string, string]> = {
  basketball: ['#FF9800', '#F44336'],
  soccer:     ['#4CAF50', '#2E7D32'],
  tennis:     ['#FFEB3B', '#F9A825'],
  running:    ['#4FC3F7', '#0288D1'],
  yoga:       ['#CE93D8', '#7B1FA2'],
  climbing:   ['#A5D6A7', '#2E7D32'],
  swimming:   ['#26C6DA', '#006064'],
  gym:        ['#FF7043', '#BF360C'],
  default:    ['#FF6B35', '#FF3366'],
};

const SPORT_FILTERS = ['All', '🏀', '⚽', '🎾', '🏃', '🧘', '🧗'];

const GroupCard: React.FC<{ group: GroupChatType; onPress: () => void }> = ({
  group,
  onPress,
}) => {
  const lastMsg = group.messages[group.messages.length - 1];
  const gradient = SPORT_GRADIENTS[group.sport.id] ?? SPORT_GRADIENTS.default;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Icon */}
      <View style={styles.iconWrap}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}
        >
          <Text style={styles.iconEmoji}>{group.coverEmoji}</Text>
        </LinearGradient>
        {group.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{group.unreadCount}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.cardInfo}>
        <View style={styles.cardRow}>
          <Text style={styles.groupName} numberOfLines={1}>
            {group.name}
          </Text>
          <Text style={styles.timeText}>{lastMsg ? formatTime(lastMsg.timestamp) : ''}</Text>
        </View>

        <View style={styles.membersRow}>
          {group.members.slice(0, 3).map((member, i) => (
            <Image
              key={member.id}
              source={{ uri: member.photos[0] }}
              style={[styles.memberAvatar, i > 0 && styles.memberOverlap]}
            />
          ))}
          <Text style={styles.memberCount}>
            +{group.memberCount - Math.min(3, group.members.length)} members
          </Text>
        </View>

        <Text style={styles.lastMsg} numberOfLines={1}>
          {lastMsg?.text ?? group.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const GroupChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = MOCK_GROUPS.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.sport.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = MOCK_GROUPS.reduce((acc, g) => acc + g.unreadCount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Groups</Text>
            {totalUnread > 0 && (
              <Text style={styles.headerSub}>{totalUnread} new messages</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreateGroup')}
          >
            <LinearGradient
              colors={['#FF6B35', '#FF3366']}
              style={styles.addGradient}
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groups or sports..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── Find-your-crew banner ───────────────────────────────────────── */}
      {search.length === 0 && (
        <TouchableOpacity style={styles.crewBanner} activeOpacity={0.85}>
          <LinearGradient
            colors={['#FF6B35', '#FF3366']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.crewGradient}
          >
            <Ionicons name="flash" size={22} color={Colors.white} />
            <View style={styles.crewText}>
              <Text style={styles.crewTitle}>Find your crew</Text>
              <Text style={styles.crewSub}>Join groups matching your sports</Text>
            </View>
            <View style={styles.crewArrow}>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* ── Sport filter pills ─────────────────────────────────────────── */}
      {search.length === 0 && (
        <View style={styles.pillsRow}>
          {SPORT_FILTERS.map((f) => {
            const active = f === activeFilter;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setActiveFilter(f)}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── Group list ─────────────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <GroupCard
            group={item}
            onPress={() => navigation.navigate('GroupChat', { group: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyTitle}>No groups found</Text>
            <Text style={styles.emptySub}>Try a different search or create one!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: Colors.surface,
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { ...Typography.h2, color: Colors.textPrimary },
  headerSub: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  addGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  // ── Crew banner ───────────────────────────────────────────────────────────
  crewBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.md,
  },
  crewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  crewText: { flex: 1 },
  crewTitle: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
  crewSub: { ...Typography.caption, color: 'rgba(255,255,255,0.82)', marginTop: 2 },
  crewArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Filter pills ──────────────────────────────────────────────────────────
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  pillTextActive: { color: Colors.white },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: 100,
    gap: Spacing.sm,
  },

  // ── Group card ────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: { position: 'relative' },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: { fontSize: 26 },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  unreadText: { color: Colors.white, fontWeight: '800', fontSize: 10, lineHeight: 13 },

  cardInfo: { flex: 1, gap: 4, justifyContent: 'center' },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupName: { ...Typography.h4, color: Colors.textPrimary, flex: 1, marginRight: Spacing.sm },
  timeText: { ...Typography.caption, color: Colors.textMuted },

  membersRow: { flexDirection: 'row', alignItems: 'center' },
  memberAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  memberOverlap: { marginLeft: -7 },
  memberCount: { ...Typography.caption, color: Colors.textMuted, marginLeft: Spacing.sm },
  lastMsg: { ...Typography.body, color: Colors.textSecondary },

  // ── Empty ─────────────────────────────────────────────────────────────────
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary },
  emptySub: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
