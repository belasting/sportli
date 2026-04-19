import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_CONVERSATIONS } from '../data/mockChats';
import { Conversation, RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
};

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.matchedUser.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalUnread = MOCK_CONVERSATIONS.reduce((acc, c) => acc + c.unreadCount, 0);

  const renderConversation = ({ item }: { item: Conversation }) => {
    const lastMsg = item.messages[item.messages.length - 1];
    const isOwn = lastMsg?.senderId === 'me';

    return (
      <TouchableOpacity
        style={styles.convItem}
        onPress={() => navigation.navigate('ChatConversation', { conversation: item })}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => navigation.navigate('UserProfile', { user: item.matchedUser })}
        >
          <Image source={{ uri: item.matchedUser.photos[0] }} style={styles.avatar} />
          <View style={styles.onlineDot} />
        </TouchableOpacity>

        <View style={styles.convContent}>
          <View style={styles.convHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{item.matchedUser.name}</Text>
              {item.matchedUser.isVerified && (
                <Ionicons name="checkmark-circle" size={13} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.timeText}>{lastMsg ? formatTime(lastMsg.timestamp) : ''}</Text>
          </View>

          <View style={styles.msgRow}>
            <Text
              style={[styles.lastMsg, item.unreadCount > 0 && styles.lastMsgUnread]}
              numberOfLines={1}
            >
              {isOwn ? 'You: ' : ''}
              {lastMsg?.text}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>

          <View style={styles.sportTags}>
            {item.matchedUser.sports.slice(0, 2).map((sport) => (
              <View key={sport.id} style={styles.sportTag}>
                <Text style={styles.sportTagText}>{sport.emoji}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Messages</Text>
            {totalUnread > 0 && (
              <Text style={styles.headerSub}>
                {totalUnread} unread message{totalUnread > 1 ? 's' : ''}
              </Text>
            )}
          </View>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="create-outline" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
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

      {/* ── New matches carousel ─────────────────────────────────────────── */}
      {search.length === 0 && (
        <View style={styles.matchesSection}>
          <Text style={styles.sectionLabel}>New Matches</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={MOCK_CONVERSATIONS.slice(0, 5)}
            keyExtractor={(item) => `match-${item.id}`}
            contentContainerStyle={styles.matchesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.matchItem}
                onPress={() => navigation.navigate('ChatConversation', { conversation: item })}
              >
                <View style={styles.matchAvatarWrap}>
                  <Image source={{ uri: item.matchedUser.photos[0] }} style={styles.matchAvatar} />
                  {item.unreadCount > 0 && (
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchBadgeText}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.matchName} numberOfLines={1}>
                  {item.matchedUser.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* ── Conversation list ────────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderConversation}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySub}>Match with someone to start chatting!</Text>
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
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    backgroundColor: Colors.surface,
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
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
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

  // ── Matches carousel ──────────────────────────────────────────────────────
  matchesSection: {
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing.xl,
    fontWeight: '600',
  },
  matchesList: { paddingHorizontal: Spacing.xl, gap: Spacing.base },
  matchItem: { alignItems: 'center', gap: 6, width: 66 },
  matchAvatarWrap: { position: 'relative' },
  matchAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  matchBadge: {
    position: 'absolute',
    top: -2,
    right: 2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  matchBadgeText: { color: Colors.white, fontWeight: '700', fontSize: 9, lineHeight: 12 },
  matchName: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },

  // ── Conversation list ─────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: 100,
  },
  convItem: {
    flexDirection: 'row',
    gap: Spacing.base,
    paddingVertical: Spacing.base,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  convContent: { flex: 1, justifyContent: 'center', gap: 3 },
  convHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userName: { ...Typography.h4, color: Colors.textPrimary },
  timeText: { ...Typography.caption, color: Colors.textMuted },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  lastMsg: { flex: 1, ...Typography.body, color: Colors.textSecondary },
  lastMsgUnread: { color: Colors.textPrimary, fontWeight: '600' },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: Colors.white, fontWeight: '700', fontSize: 10, lineHeight: 13 },
  sportTags: { flexDirection: 'row', gap: 4 },
  sportTag: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sportTagText: { fontSize: 12 },
  separator: { height: 1, backgroundColor: Colors.border },

  // ── Empty ─────────────────────────────────────────────────────────────────
  empty: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary },
  emptySub: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
