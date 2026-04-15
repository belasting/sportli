import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { RootStackParamList, GroupMessage } from '../types';
import { CURRENT_USER } from '../data/mockUsers';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GroupChatConversation'>;
  route: RouteProp<RootStackParamList, 'GroupChatConversation'>;
};

const MOCK_MESSAGES: GroupMessage[] = [
  {
    id: 'm1',
    senderId: '1',
    senderName: 'Alex Rivera',
    senderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    text: 'Hey everyone! Who is up for a session this weekend? 🏃',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: 'm2',
    senderId: '2',
    senderName: 'Mia Chen',
    senderPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    text: "I'm in! Saturday morning works best for me 💪",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5),
  },
  {
    id: 'm3',
    senderId: '3',
    senderName: 'Jordan Hayes',
    senderPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
    text: "Same! Let's meet at 8am at the usual spot?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: 'm4',
    senderId: '1',
    senderName: 'Alex Rivera',
    senderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    text: "Perfect! I'll bring extra water 🙌",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
];

const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateHeader = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
};

export const GroupChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { group } = route.params;
  const [messages, setMessages] = useState<GroupMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const sendScale = useRef(new Animated.Value(1)).current;

  const handleSend = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.spring(sendScale, { toValue: 0.85, useNativeDriver: true, friction: 4 }),
      Animated.spring(sendScale, { toValue: 1, useNativeDriver: true, friction: 4 }),
    ]).start();

    const newMsg: GroupMessage = {
      id: `m${Date.now()}`,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      senderPhoto: CURRENT_USER.photos[0],
      text: inputText.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const isOwn = (msg: GroupMessage) => msg.senderId === CURRENT_USER.id;

  const renderMessage = ({ item, index }: { item: GroupMessage; index: number }) => {
    const own = isOwn(item);
    const prevMsg = messages[index - 1];
    const showSenderInfo = !own && (!prevMsg || prevMsg.senderId !== item.senderId);
    const showDateHeader =
      !prevMsg ||
      new Date(item.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();

    return (
      <View>
        {showDateHeader && (
          <View style={styles.dateHeaderRow}>
            <View style={styles.dateLine} />
            <Text style={styles.dateHeaderText}>{formatDateHeader(item.timestamp)}</Text>
            <View style={styles.dateLine} />
          </View>
        )}
        <View style={[styles.messageRow, own && styles.messageRowOwn]}>
          {!own && (
            <View style={styles.avatarCol}>
              {showSenderInfo ? (
                <Image source={{ uri: item.senderPhoto }} style={styles.senderAvatar} />
              ) : (
                <View style={styles.senderAvatarSpacer} />
              )}
            </View>
          )}
          <View style={[styles.bubbleWrap, own && styles.bubbleWrapOwn]}>
            {showSenderInfo && !own && (
              <Text style={styles.senderName}>{item.senderName}</Text>
            )}
            <View style={[styles.bubble, own ? styles.bubbleOwn : styles.bubbleOther]}>
              {own ? (
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <Text style={[styles.bubbleText, own && styles.bubbleTextOwn]}>
                {item.text}
              </Text>
            </View>
            <Text style={[styles.bubbleTime, own && styles.bubbleTimeOwn]}>
              {formatMessageTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerCenter}
          onPress={() => setShowMembers(!showMembers)}
          activeOpacity={0.8}
        >
          {group.coverPhoto ? (
            <Image source={{ uri: group.coverPhoto }} style={styles.headerAvatar} />
          ) : (
            <View style={[styles.headerAvatar, styles.headerAvatarFallback]}>
              <Text style={{ fontSize: 18 }}>{group.sport.emoji}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.headerName} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={styles.headerMeta}>
              {group.sport.emoji} {group.sport.name} · {group.members.length} members
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Members panel (collapsible) */}
      {showMembers && (
        <View style={styles.membersPanel}>
          <Text style={styles.membersPanelTitle}>Members ({group.members.length})</Text>
          <View style={styles.membersList}>
            {group.members.map((member) => (
              <View key={member.id} style={styles.memberItem}>
                <Image source={{ uri: member.photos[0] }} style={styles.memberItemAvatar} />
                <Text style={styles.memberItemName} numberOfLines={1}>
                  {member.id === CURRENT_USER.id ? 'You' : member.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="attach" size={22} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Message group..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
        </View>

        <Animated.View style={{ transform: [{ scale: sendScale }] }}>
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            activeOpacity={0.8}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={
                inputText.trim()
                  ? [Colors.primary, Colors.primaryDark]
                  : [Colors.border, Colors.border]
              }
              style={styles.sendBtnGradient}
            >
              <Ionicons
                name="send"
                size={18}
                color={inputText.trim() ? Colors.white : Colors.textMuted}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingBottom: Spacing.base,
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  headerAvatarFallback: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { gap: 1 },
  headerName: { ...Typography.labelLarge, color: Colors.white, fontWeight: '700' },
  headerMeta: { ...Typography.caption, color: 'rgba(255,255,255,0.75)' },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Members panel
  membersPanel: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.base,
    gap: Spacing.md,
  },
  membersPanelTitle: { ...Typography.label, color: Colors.textSecondary, fontWeight: '700' },
  membersList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  memberItem: { alignItems: 'center', gap: 4, width: 56 },
  memberItemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  memberItemName: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 10,
  },

  // Messages
  messagesList: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  dateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.base,
  },
  dateLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dateHeaderText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  messageRowOwn: { justifyContent: 'flex-end' },
  avatarCol: { width: 30, alignItems: 'center' },
  senderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  senderAvatarSpacer: { width: 28, height: 28 },
  bubbleWrap: {
    maxWidth: '72%',
    gap: 2,
  },
  bubbleWrapOwn: { alignItems: 'flex-end' },
  senderName: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 2,
    marginLeft: 2,
  },
  bubble: {
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    overflow: 'hidden',
  },
  bubbleOwn: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.sm,
  },
  bubbleOther: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: BorderRadius.sm,
    ...Shadow.sm,
  },
  bubbleText: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextOwn: { color: Colors.white },
  bubbleTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    marginLeft: 4,
  },
  bubbleTimeOwn: { marginLeft: 0, marginRight: 4, textAlign: 'right' },

  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 32 : Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    maxHeight: 120,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    padding: 0,
    margin: 0,
  },
  sendBtn: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  sendBtnDisabled: { opacity: 0.6 },
  sendBtnGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
