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
import { Typography, Spacing, BorderRadius } from '../theme';
import { useTheme } from '../context/ThemeContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
};

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { isDark, colors } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.matchedUser.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = MOCK_CONVERSATIONS.reduce((acc, c) => acc + c.unreadCount, 0);

  const bg = isDark ? '#000' : '#fff';
  const cardBg = isDark ? '#1C1C1E' : '#fff';
  const searchBg = isDark ? '#1C1C1E' : '#F2F2F7';
  const separatorColor = isDark ? '#38383A' : '#F2F2F7';

  const renderItem = ({ item }: { item: Conversation }) => {
    const lastMsg = item.messages[item.messages.length - 1];
    const isOwn = lastMsg?.senderId === 'me';
    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: cardBg }]}
        onPress={() => navigation.navigate('ChatConversation', { conversation: item })}
        activeOpacity={0.6}
      >
        {/* Avatar */}
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { user: item.matchedUser })}
          style={styles.avatarWrap}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.matchedUser.photos[0] }} style={styles.avatar} />
          {/* Online indicator */}
          <View style={[styles.onlineDot, { borderColor: cardBg }]} />
        </TouchableOpacity>

        {/* Text content */}
        <View style={[styles.content, { borderBottomColor: separatorColor }]}>
          <View style={styles.topRow}>
            <View style={styles.nameWrap}>
              <Text style={[styles.name, { color: colors.textPrimary }, hasUnread && styles.nameUnread]}>
                {item.matchedUser.name}
              </Text>
              {item.matchedUser.isVerified && (
                <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
              )}
            </View>
            <Text style={[styles.time, { color: hasUnread ? colors.primary : colors.textMuted }]}>
              {lastMsg ? formatTime(lastMsg.timestamp) : ''}
            </Text>
          </View>

          <View style={styles.bottomRow}>
            <Text
              style={[
                styles.preview,
                { color: hasUnread ? colors.textPrimary : colors.textMuted },
                hasUnread && styles.previewUnread,
              ]}
              numberOfLines={1}
            >
              {isOwn ? '↩ ' : ''}
              {lastMsg?.text ?? 'New match!'}
            </Text>
            {hasUnread ? (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{item.unreadCount > 9 ? '9+' : item.unreadCount}</Text>
              </View>
            ) : (
              <Ionicons name="checkmark-done" size={14} color={colors.textMuted} />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* iOS Large-title style header */}
      <View style={[styles.header, { backgroundColor: bg, borderBottomColor: isDark ? '#38383A' : 'transparent' }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Messages</Text>
          <TouchableOpacity
            style={[styles.composeBtn, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {totalUnread > 0 && (
          <Text style={[styles.unreadHint, { color: colors.primary }]}>
            {totalUnread} unread message{totalUnread > 1 ? 's' : ''}
          </Text>
        )}

        {/* Search bar — iOS-style rounded gray */}
        <View style={[styles.searchBar, { backgroundColor: searchBg }]}>
          <Ionicons name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Search"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle-sharp" size={17} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* New Matches row */}
      <View style={[styles.matchesBar, { backgroundColor: bg, borderBottomColor: isDark ? '#38383A' : '#F2F2F7' }]}>
        <Text style={[styles.matchesLabel, { color: colors.textMuted }]}>NEW MATCHES</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOCK_CONVERSATIONS.slice(0, 6)}
          keyExtractor={(item) => `m-${item.id}`}
          contentContainerStyle={styles.matchesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.matchItem}
              onPress={() => navigation.navigate('ChatConversation', { conversation: item })}
              activeOpacity={0.75}
            >
              <View style={styles.matchAvatarWrap}>
                <Image source={{ uri: item.matchedUser.photos[0] }} style={styles.matchAvatar} />
                {item.unreadCount > 0 && (
                  <View style={[styles.matchBadge, { borderColor: bg }]}>
                    <Text style={styles.matchBadgeText}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.matchName, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.matchedUser.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Conversations */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={52} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No messages yet</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              Match with athletes to start chatting!
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { ...Typography.h1, fontWeight: '700', letterSpacing: -0.5 },
  composeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadHint: { ...Typography.caption, fontWeight: '600', marginTop: -2 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    padding: 0,
  },

  // Matches
  matchesBar: {
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  matchesLabel: {
    ...Typography.labelSmall,
    paddingHorizontal: 20,
  },
  matchesList: { paddingHorizontal: 16, gap: 14 },
  matchItem: { alignItems: 'center', gap: 5, width: 64 },
  matchAvatarWrap: { position: 'relative' },
  matchAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
    borderColor: '#4FC3F7',
  },
  matchBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  matchBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },
  matchName: { ...Typography.caption, textAlign: 'center', fontWeight: '500' },

  // Conversation row (iMessage-style)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatar: { width: 54, height: 54, borderRadius: 27 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#30D158',
    borderWidth: 2,
  },
  // Content fills width, has its own bottom border (like iOS)
  content: {
    flex: 1,
    paddingVertical: 13,
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { ...Typography.labelLarge, fontWeight: '500' },
  nameUnread: { fontWeight: '700' },
  time: { ...Typography.caption },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  preview: { flex: 1, ...Typography.body, lineHeight: 20 },
  previewUnread: { fontWeight: '500' },
  badge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 11, color: '#fff', fontWeight: '800' },

  // Empty
  empty: { alignItems: 'center', paddingTop: 80, gap: 12, paddingHorizontal: 32 },
  emptyTitle: { ...Typography.h3 },
  emptySub: { ...Typography.body, textAlign: 'center' },
});
