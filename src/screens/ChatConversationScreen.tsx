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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Message } from '../types';
import { MessageBubble } from '../components/MessageBubble';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChatConversation'>;
  route: RouteProp<RootStackParamList, 'ChatConversation'>;
};

const formatMessageDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
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
    const prevMsg = messages[index - 1];
    const showDate = !prevMsg ||
      new Date(item.timestamp).getDate() !== new Date(prevMsg.timestamp).getDate();

    return (
      <View>
        {showDate && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatMessageDate(item.timestamp)}</Text>
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: matchedUser.photos[0] }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{matchedUser.name}</Text>
              {matchedUser.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.statusText}>
              {matchedUser.sports[0]?.emoji} {matchedUser.sports[0]?.name} player · Active now
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="videocam-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="ellipsis-horizontal" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout plan banner */}
      <TouchableOpacity style={styles.workoutBanner}>
        <MaterialCommunityIcons name="dumbbell" size={18} color={Colors.secondary} />
        <Text style={styles.workoutBannerText}>Plan a workout together</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.secondary} />
      </TouchableOpacity>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Emoji suggestions */}
      <View style={styles.emojiSuggestions}>
        {['🏀', '⚽', '💪', '🔥', '👍', '😄'].map((emoji) => (
          <TouchableOpacity
            key={emoji}
            onPress={() => setText((t) => t + emoji)}
            style={styles.emojiBtn}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
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
          style={[styles.sendBtn, text.trim() ? styles.sendBtnActive : null]}
          onPress={sendMessage}
          disabled={!text.trim()}
        >
          <Ionicons
            name={text.trim() ? 'send' : 'mic-outline'}
            size={20}
            color={text.trim() ? Colors.white : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  userName: { ...Typography.h4, color: Colors.textPrimary },
  statusText: { ...Typography.caption, color: Colors.textSecondary },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  headerActionBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryLight,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  workoutBannerText: { flex: 1, ...Typography.label, color: Colors.secondary },
  messagesList: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: Spacing.base,
  },
  dateText: {
    ...Typography.caption,
    color: Colors.textMuted,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  emojiSuggestions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  emojiBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 18 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.base,
    backgroundColor: Colors.white,
  },
  attachBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    minHeight: 24,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
});
