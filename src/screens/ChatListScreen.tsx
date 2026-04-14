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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_CONVERSATIONS } from '../data/mockChats';
import { Conversation, RootStackParamList } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

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
  const [search, setSearch] = useState('');

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.matchedUser.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = MOCK_CONVERSATIONS.reduce((acc, c) => acc + c.unreadCount, 0);

  const renderItem = ({ item }: { item: Conversation }) => {
    const lastMsg = item.messages[item.messages.length - 1];
    const isOwn = lastMsg?.senderId === 'me';

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('ChatConversation', { conversation: item })}
        activeOpacity={0.7}
      >

        {/* Avatar — tik om profiel te bekijken */}
        <TouchableOpacity
          onPress={() => navigation.navigate('UserProfile', { user: item.matchedUser })}
          style={styles.avatarContainer}
        >
          <Image
            source={{ uri: item.matchedUser.photos[0] }}
            style={styles.avatar}
          />
          <View style={styles.onlineDot} />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{item.matchedUser.name}</Text>
              {item.matchedUser.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.timeText}>
              {lastMsg ? formatTime(lastMsg.timestamp) : ''}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text
              style={[styles.lastMessage, item.unreadCount > 0 && styles.lastMessageUnread]}
              numberOfLines={1}
            >
              {isOwn ? 'You: ' : ''}{lastMsg?.text}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
          {/* Sport tags */}
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
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Messages</Text>
            {totalUnread > 0 && (
              <Text style={styles.headerSubtitle}>{totalUnread} unread message{totalUnread > 1 ? 's' : ''}</Text>
            )}
          </View>
          <TouchableOpacity style={styles.newChatBtn}>
            <Ionicons name="create-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
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

      {/* Matches carousel */}
      <View style={styles.matchesSection}>
        <Text style={styles.sectionTitle}>New Matches</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={MOCK_CONVERSATIONS.slice(0, 5)}
          keyExtractor={(item) => `match-${item.id}`}
          contentContainerStyle={styles.matchesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.matchCircle}
              onPress={() => navigation.navigate('ChatConversation', { conversation: item })}
            >
              <Image source={{ uri: item.matchedUser.photos[0] }} style={styles.matchAvatar} />
              {item.unreadCount > 0 && (
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>{item.unreadCount}</Text>
                </View>
              )}
              <Text style={styles.matchName} numberOfLines={1}>
                {item.matchedUser.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Conversation list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="chat-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>Match with someone to start chatting!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.base,
    backgroundColor: Colors.white,
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
  headerSubtitle: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '600' },
  newChatBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  matchesSection: {
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    paddingHorizontal: Spacing['2xl'],
  },
  matchesList: { paddingHorizontal: Spacing['2xl'], gap: Spacing.base },
  matchCircle: { alignItems: 'center', gap: 6, width: 70 },
  matchAvatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 2.5,
    borderColor: Colors.primary,
  },
  matchBadge: {
    position: 'absolute',
    top: 0,
    right: 4,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  matchBadgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  matchName: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  listContent: { paddingHorizontal: Spacing['2xl'], paddingTop: Spacing.sm, paddingBottom: 100 },
  conversationItem: {
    flexDirection: 'row',
    gap: Spacing.base,
    paddingVertical: Spacing.md,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  conversationContent: { flex: 1, justifyContent: 'center', gap: 3 },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userName: { ...Typography.h4, color: Colors.textPrimary },
  timeText: { ...Typography.caption, color: Colors.textMuted },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  lastMessage: { flex: 1, ...Typography.body, color: Colors.textSecondary },
  lastMessageUnread: { color: Colors.textPrimary, fontWeight: '600' },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  sportTags: { flexDirection: 'row', gap: 4 },
  sportTag: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportTagText: { fontSize: 12 },
  separator: { height: 1, backgroundColor: Colors.border },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['5xl'],
    gap: Spacing.md,
  },
  emptyTitle: { ...Typography.h3, color: Colors.textPrimary },
  emptySubtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
