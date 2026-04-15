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
  Modal,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
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

type AttachOption = {
  icon: string;
  label: string;
  sublabel: string;
  iconBg: string;
  iconLib: 'ion' | 'mci';
};

const ATTACH_OPTIONS: AttachOption[] = [
  { icon: 'camera', label: 'Camera', sublabel: 'Take a photo or video', iconBg: Colors.primary, iconLib: 'ion' },
  { icon: 'image', label: 'Photo Library', sublabel: 'Share from your gallery', iconBg: '#9B59B6', iconLib: 'ion' },
  { icon: 'location', label: 'Location', sublabel: 'Send your current spot', iconBg: Colors.accent, iconLib: 'ion' },
  { icon: 'dumbbell', label: 'Workout Plan', sublabel: 'Plan a session together', iconBg: Colors.secondary, iconLib: 'mci' },
];

export const ChatConversationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { conversation } = route.params;
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [text, setText] = useState('');
  const [attachVisible, setAttachVisible] = useState(false);
  const sheetAnim = useRef(new Animated.Value(300)).current;
  const flatListRef = useRef<FlatList>(null);
  const { matchedUser } = conversation;

  const openAttach = () => {
    setAttachVisible(true);
    Animated.spring(sheetAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 11,
    }).start();
  };

  const closeAttach = () => {
    Animated.timing(sheetAnim, {
      toValue: 300,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setAttachVisible(false));
  };

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
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate('UserProfile', { user: matchedUser })}
          activeOpacity={0.75}
        >
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: matchedUser.photos[0] }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.userMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{matchedUser.name}</Text>
              {matchedUser.isVerified && (
                <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.statusText}>
              {matchedUser.sports[0]?.emoji} Active now
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="videocam-outline" size={21} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="ellipsis-horizontal" size={21} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Workout plan banner */}
      <TouchableOpacity style={styles.workoutBanner} activeOpacity={0.8}>
        <LinearGradient
          colors={[Colors.secondaryLight, '#E8F5E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <MaterialCommunityIcons name="dumbbell" size={17} color={Colors.secondary} />
        <Text style={styles.workoutBannerText}>Plan a workout together</Text>
        <View style={styles.workoutBannerArrow}>
          <Ionicons name="arrow-forward" size={14} color={Colors.secondary} />
        </View>
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

      {/* Emoji quick-replies */}
      <View style={styles.emojiRow}>
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
        <TouchableOpacity style={styles.attachBtn} onPress={openAttach} activeOpacity={0.7}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.attachBtnGrad}
          >
            <Ionicons name="add" size={22} color={Colors.white} />
          </LinearGradient>
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
          activeOpacity={0.8}
        >
          <Ionicons
            name={text.trim() ? 'send' : 'mic-outline'}
            size={19}
            color={text.trim() ? Colors.white : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Attach sheet */}
      <Modal
        visible={attachVisible}
        transparent
        animationType="none"
        onRequestClose={closeAttach}
      >
        <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={closeAttach} />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
          {/* Handle */}
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Share something</Text>

          <View style={styles.sheetGrid}>
            {ATTACH_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.sheetOption}
                onPress={closeAttach}
                activeOpacity={0.75}
              >
                <View style={[styles.sheetOptionIcon, { backgroundColor: opt.iconBg }]}>
                  {opt.iconLib === 'ion' ? (
                    <Ionicons name={opt.icon as any} size={24} color={Colors.white} />
                  ) : (
                    <MaterialCommunityIcons name={opt.icon as any} size={24} color={Colors.white} />
                  )}
                </View>
                <Text style={styles.sheetOptionLabel}>{opt.label}</Text>
                <Text style={styles.sheetOptionSub}>{opt.sublabel}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.sheetCancel} onPress={closeAttach} activeOpacity={0.7}>
            <Text style={styles.sheetCancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
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
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userMeta: { gap: 1 },
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
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    overflow: 'hidden',
  },
  workoutBannerText: { flex: 1, ...Typography.label, color: Colors.secondary, fontWeight: '600' },
  workoutBannerArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  // Emoji quick-replies
  emojiRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  emojiBtn: {
    flex: 1,
    height: 34,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 17 },
  // Input bar
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.base,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    borderRadius: 22,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  attachBtnGrad: {
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
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    minHeight: 24,
    padding: 0,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  // Attach sheet
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Platform.OS === 'ios' ? 36 : Spacing['2xl'],
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
  sheetTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.lg },
  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sheetOption: {
    width: '46%',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  sheetOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionLabel: { ...Typography.labelLarge, color: Colors.textPrimary },
  sheetOptionSub: { ...Typography.caption, color: Colors.textMuted },
  sheetCancel: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  sheetCancelText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '700' },
});
