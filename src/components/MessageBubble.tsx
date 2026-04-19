import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const formatTime = (date: Date): string =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <View style={[styles.container, isOwn ? styles.own : styles.other]}>
      {isOwn ? (
        <LinearGradient
          colors={['#FF6B35', '#FF3366']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.bubble, styles.ownBubble]}
        >
          <Text style={[styles.text, styles.ownText]}>{message.text}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.otherBubble]}>
          <Text style={[styles.text, styles.otherText]}>{message.text}</Text>
        </View>
      )}

      <View style={[styles.timeRow, isOwn ? styles.timeRowOwn : styles.timeRowOther]}>
        <Text style={styles.time}>{formatTime(message.timestamp)}</Text>
        {isOwn && message.isRead && (
          <Ionicons name="checkmark-done" size={11} color={Colors.primary} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '76%',
    marginVertical: 3,
  },
  own: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  other: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  ownBubble: {
    borderBottomRightRadius: 5,
  },
  otherBubble: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomLeftRadius: 5,
  },
  text: {
    ...Typography.bodyLarge,
    lineHeight: 22,
  },
  ownText: {
    color: Colors.white,
  },
  otherText: {
    color: Colors.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
    marginHorizontal: Spacing.xs,
  },
  timeRowOwn: { justifyContent: 'flex-end' },
  timeRowOther: { justifyContent: 'flex-start' },
  time: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
});
