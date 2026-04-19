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
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Message } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { CURRENT_USER } from '../data/mockUsers';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GroupChat'>;
  route: RouteProp<RootStackParamList, 'GroupChat'>;
};

const SPORT_GRADIENTS: Record<string, readonly [string, string]> = {
  basketball: ['#FF9800', '#F44336'],
  soccer: ['#4CAF50', '#2E7D32'],
  tennis: ['#FFEB3B', '#F9A825'],
  running: ['#4FC3F7', '#0288D1'],
  yoga: ['#CE93D8', '#7B1FA2'],
  climbing: ['#A5D6A7', '#2E7D32'],
  default: ['#4FC3F7', '#0288D1'],
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

const GroupBubble: React.FC<{
  message: Message;
  isOwn: boolean;
  senderName: string;
  senderPhoto: string;
  showAvatar: boolean;
}> = ({ message, isOwn, senderName, senderPhoto, showAvatar }) => (
  <View style={[gb.row, isOwn && gb.rowOwn]}>
    {!isOwn && showAvatar ? (
      <Image source={{ uri: senderPhoto }} style={gb.avatar} />
    ) : !isOwn ? (
      <View style={gb.avatarGap} />
    ) : null}
    <View style={[gb.bubbleWrap, isOwn && gb.bubbleWrapOwn]}>
      {!isOwn && showAvatar && (
        <Text style={gb.senderName}>{senderName}</Text>
      )}
      {isOwn ? (
        <LinearGradient
          colors={['#FF6B35', '#FF3366']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[gb.bubble, gb.ownBubble]}
        >
          <Text style={[gb.text, gb.ownText]}>{message.text}</Text>
        </LinearGradient>
      ) : (
        <View style={[gb.bubble, gb.otherBubble]}>
          <Text style={gb.text}>{message.text}</Text>
        </View>
      )}
      <Text style={[gb.time, isOwn && gb.ownTime]}>{formatTime(message.timestamp)}</Text>
    </View>
  </View>
);

const gb = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, marginVertical: 2 },
  rowOwn: { flexDirection: 'row-reverse' },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  avatarGap: { width: 30 },
  bubbleWrap: { maxWidth: '72%', gap: 3 },
  bubbleWrapOwn: { alignItems: 'flex-end' },
  senderName: { ...Typography.caption, color: Colors.primary, fontWeight: '700', marginLeft: 2 },
  bubble: {
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  ownBubble: {
    borderBottomRightRadius: BorderRadius.sm,
  },
  otherBubble: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomLeftRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: { ...Typography.bodyLarge, color: Colors.textPrimary, lineHeight: 22 },
  ownText: { color: Colors.white },
  time: { ...Typography.caption, color: Colors.textMuted, marginHorizontal: 4 },
  ownTime: { textAlign: 'right' },
});

export const GroupChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { group } = route.params;
  const [messages, setMessages] = useState<Message[]>(group.messages);
  const [text, setText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const gradient = SPORT_GRADIENTS[group.sport.id] ?? SPORT_GRADIENTS.default;

  const getSender = (senderId: string) =>
    group.members.find((m) => m.id === senderId);

  const sendMessage = () => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `gm${Date.now()}`,
      senderId: 'me',
      text: text.trim(),
      timestamp: new Date(),
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={gradient as any} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverEmoji}>{group.coverEmoji}</Text>
          </View>
          <View>
            <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
            <Text style={styles.memberLabel}>{group.memberCount} members</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="ellipsis-horizontal" size={22} color={Colors.white} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Members preview strip */}
      <View style={styles.membersStrip}>
        {group.members.slice(0, 5).map((m, i) => (
          <Image
            key={m.id}
            source={{ uri: m.photos[0] }}
            style={[styles.memberThumb, { marginLeft: i > 0 ? -6 : 0, zIndex: 5 - i }]}
          />
        ))}
        <Text style={styles.membersText}>
          {group.memberCount} playing {group.sport.emoji} {group.sport.name}
        </Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item, index }) => {
          const isOwn = item.senderId === 'me';
          const sender = getSender(item.senderId);
          const prevMsg = messages[index - 1];
          const showAvatar = !prevMsg || prevMsg.senderId !== item.senderId;
          return (
            <GroupBubble
              message={item}
              isOwn={isOwn}
              senderName={sender?.name.split(' ')[0] ?? ''}
              senderPhoto={sender?.photos[0] ?? ''}
              showAvatar={showAvatar}
            />
          );
        }}
      />

      {/* Emoji quick reactions */}
      <View style={styles.reactions}>
        {['🏀', '⚽', '💪', '🔥', '👍', '😄', '🎉'].map((e) => (
          <TouchableOpacity
            key={e}
            style={styles.reactionBtn}
            onPress={() => setText((t) => t + e)}
          >
            <Text style={styles.reactionEmoji}>{e}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={`Message ${group.name}...`}
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, text.trim() ? styles.sendBtnActive : null]}
          onPress={sendMessage}
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
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  coverBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: { fontSize: 20 },
  groupName: { ...Typography.h4, color: Colors.white },
  memberLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.8)' },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  membersStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  memberThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  membersText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
  messagesList: {
    padding: Spacing.base,
    gap: 2,
    paddingBottom: Spacing.lg,
  },
  reactions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  reactionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionEmoji: { fontSize: 18 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.base,
    backgroundColor: Colors.surface,
  },
  attachBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrap: {
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
  sendBtnActive: { backgroundColor: Colors.primary },
});
