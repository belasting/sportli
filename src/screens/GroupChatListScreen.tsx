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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const SPORT_GRADIENTS: Record<string, readonly [string, string]> = {
  basketball: ['#FF9800', '#F44336'],
  soccer: ['#4CAF50', '#2E7D32'],
  tennis: ['#FFEB3B', '#F9A825'],
  running: ['#4FC3F7', '#0288D1'],
  yoga: ['#CE93D8', '#7B1FA2'],
  climbing: ['#A5D6A7', '#2E7D32'],
  swimming: ['#4FC3F7', '#006064'],
  gym: ['#FF7043', '#BF360C'],
  default: ['#4FC3F7', '#0288D1'],
};

const GroupCard: React.FC<{ group: GroupChatType; onPress: () => void }> = ({ group, onPress }) => {
  const lastMsg = group.messages[group.messages.length - 1];
  const gradient = SPORT_GRADIENTS[group.sport.id] ?? SPORT_GRADIENTS.default;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      {/* Cover */}
      <LinearGradient
        colors={gradient as any}
        style={styles.cover}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.coverEmoji}>{group.coverEmoji}</Text>
        {group.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{group.unreadCount}</Text>
          </View>
        )}
      </LinearGradient>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.infoTop}>
          <View style={styles.nameRow}>
            <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
          </View>
          <Text style={styles.timeText}>
            {lastMsg ? formatTime(lastMsg.timestamp) : ''}
          </Text>
        </View>

        <View style={styles.membersRow}>
          {group.members.slice(0, 3).map((member, i) => (
            <Image
              key={member.id}
              source={{ uri: member.photos[0] }}
              style={[styles.memberAvatar, { marginLeft: i > 0 ? -8 : 0, zIndex: 3 - i }]}
            />
          ))}
          <Text style={styles.memberCount}>
            +{group.memberCount - Math.min(3, group.members.length)} members
          </Text>
        </View>

        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMsg?.text ?? group.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const GroupChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');

  const filtered = MOCK_GROUPS.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.sport.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = MOCK_GROUPS.reduce((acc, g) => acc + g.unreadCount, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Groups</Text>
            {totalUnread > 0 && (
              <Text style={styles.headerSub}>{totalUnread} new messages</Text>
            )}
          </View>
          <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateGroup')}>
            <Ionicons name="add" size={22} color={Colors.white} />
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

      {/* Featured banner */}
      {search.length === 0 && (
        <View style={styles.featuredBanner}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.featuredGradient}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={Colors.white} />
            <View style={styles.featuredText}>
              <Text style={styles.featuredTitle}>Find your crew</Text>
              <Text style={styles.featuredSub}>Join groups matching your sports</Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </View>
      )}

      {/* Sport filter pills */}
      {search.length === 0 && (
        <View style={styles.sportPills}>
          {['All', '🏀', '⚽', '🎾', '🏃', '🧘', '🧗'].map((s) => (
            <TouchableOpacity key={s} style={styles.sportPill}>
              <Text style={styles.sportPillText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

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
            <MaterialCommunityIcons name="account-group-outline" size={56} color={Colors.textMuted} />
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
  header: {
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingHorizontal: Spacing['2xl'],
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
  headerSub: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '600' },
  createBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.textPrimary },

  featuredBanner: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  featuredGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
  },
  featuredText: { flex: 1 },
  featuredTitle: { ...Typography.labelLarge, color: Colors.white },
  featuredSub: { ...Typography.caption, color: 'rgba(255,255,255,0.8)' },

  sportPills: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  sportPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  sportPillText: { fontSize: 16 },

  listContent: { padding: Spacing.base, gap: Spacing.md, paddingBottom: 100 },

  card: {
    flexDirection: 'row',
    gap: Spacing.base,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  cover: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  coverEmoji: { fontSize: 28 },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  unreadText: { ...Typography.caption, color: Colors.white, fontWeight: '800', fontSize: 10 },
  info: { flex: 1, gap: 4, justifyContent: 'center' },
  infoTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nameRow: { flex: 1 },
  groupName: { ...Typography.h4, color: Colors.textPrimary },
  timeText: { ...Typography.caption, color: Colors.textMuted },
  membersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  memberAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  memberCount: { ...Typography.caption, color: Colors.textMuted, marginLeft: 4 },
  lastMessage: { ...Typography.body, color: Colors.textSecondary },

  empty: { alignItems: 'center', paddingTop: Spacing['5xl'], gap: Spacing.md },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary },
  emptySub: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
