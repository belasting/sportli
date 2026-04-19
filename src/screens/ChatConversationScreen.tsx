import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Message } from '../types';
import { MessageBubble } from '../components/MessageBubble';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChatConversation'>;
  route: RouteProp<RootStackParamList, 'ChatConversation'>;
};

const formatDate = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  if (diff < 86400000) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const ChatConversationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { conversation } = route.params;
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { matchedUser } = conversation;

  const sendMessage = () => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: text.trim(),
      timestamp: new Date(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.senderId === 'me';
    const prev = messages[index - 1];
    const showDate =
      !prev || new Date(item.timestamp).getDate() !== new Date(prev.timestamp).getDate();
    return (
      <View>
        {showDate && (
          <View style={styles.dateSep}>
            <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          </View>
        )}
        <MessageBubble message={item} isOwn={isOwn} />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate('UserProfile', { user: matchedUser })}
        >
          <View style={styles.avatarWrap}>
            <Image source={{ uri: matchedUser.photos[0] }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.userText}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{matchedUser.name}</Text>
              {matchedUser.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.statusText}>
              {matchedUser.sports[0]?.emoji} {matchedUser.sports[0]?.name} · Active now
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="videocam-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Workout banner ────────────────────────────────────────────────── */}
      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>🏀</Text>
        <Text style={styles.bannerText}>Plan a workout together</Text>
        <TouchableOpacity style={styles.planBtn} activeOpacity={0.85}>
          <LinearGradient
            colors={['#FF6B35', '#FF3366']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.planGradient}
          >
            <Text style={styles.planText}>Plan</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* ── Emoji bar ─────────────────────────────────────────────────────── */}
      <View style={styles.emojiBar}>
        {['🏀', '⚽', '💪', '🔥', '👍', '😄'].map((e) => (
          <TouchableOpacity
            key={e}
            style={styles.emojiBtn}
            onPress={() => setText((t) => t + e)}
          >
            <Text style={styles.emojiText}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Input bar ─────────────────────────────────────────────────────── */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachWrap}>
          <LinearGradient
            colors={['#FF6B35', '#FF3366']}
            style={styles.attachGradient}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Message..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
          />
        </View>

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={sendMessage}
          disabled={!text.trim()}
        >
          {text.trim() ? (
            <LinearGradient
              colors={['#FF6B35', '#FF3366']}
              style={styles.sendGradient}
            >
              <Ionicons name="send" size={17} color={Colors.white} />
            </LinearGradient>
          ) : (
            <Ionicons name="mic-outline" size={24} color={Colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 40,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.xs,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userText: { gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userName: { ...Typography.h4, color: Colors.textPrimary },
  statusText: { ...Typography.caption, color: Colors.textSecondary },
  headerRight: { flexDirection: 'row' },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bannerEmoji: { fontSize: 18 },
  bannerText: { flex: 1, ...Typography.label, color: Colors.textPrimary },
  planBtn: { borderRadius: BorderRadius.full, overflow: 'hidden' },
  planGradient: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  planText: { ...Typography.label, color: Colors.white, fontWeight: '700' },

  messagesList: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.xs,
  },
  dateSep: { alignItems: 'center', marginVertical: Spacing.base },
  dateText: {
    ...Typography.caption,
    color: Colors.textMuted,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    overflow: 'hidden',
  },

  emojiBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  emojiBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 18 },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.base,
    backgroundColor: Colors.surface,
  },
  attachWrap: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden' },
  attachGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { ...Typography.bodyLarge, color: Colors.textPrimary, minHeight: 24 },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  sendGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
