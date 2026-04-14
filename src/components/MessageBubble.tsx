import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  return (
    <View style={[styles.container, isOwn ? styles.own : styles.other]}>
      <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.text, isOwn ? styles.ownText : styles.otherText]}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: '75%',
    marginVertical: 2,
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
    borderRadius: BorderRadius['2xl'],
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.sm,
  },
  otherBubble: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  text: {
    ...Typography.bodyLarge,
  },
  ownText: {
    color: Colors.white,
  },
  otherText: {
    color: Colors.textPrimary,
  },
  time: {
    ...Typography.caption,
    marginTop: 3,
    marginHorizontal: Spacing.xs,
  },
  ownTime: {
    color: Colors.textMuted,
  },
  otherTime: {
    color: Colors.textMuted,
  },
});
