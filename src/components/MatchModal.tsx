import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { useAnimatedPress } from '../hooks/useAnimatedPress';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MatchModalProps {
  visible: boolean;
  currentUser: User;
  matchedUser: User;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({
  visible,
  currentUser,
  matchedUser,
  onSendMessage,
  onKeepSwiping,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const photosAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      titleAnim.setValue(0);
      photosAnim.setValue(0);
      buttonsAnim.setValue(0);
      heartScale.setValue(0);

      Animated.sequence([
        // Fade in backdrop
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Pop in main card
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 60,
          useNativeDriver: true,
        }),
        // Stagger elements
        Animated.stagger(120, [
          Animated.spring(photosAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
          Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
          Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 80 }),
          Animated.spring(buttonsAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
        ]),
      ]).start();

      // Continuous heart pulse
      Animated.loop(
        Animated.sequence([
          Animated.spring(heartScale, { toValue: 1.25, useNativeDriver: true, friction: 3 }),
          Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
        ])
      ).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['rgba(79,195,247,0.97)', 'rgba(2,136,209,0.97)']}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
        >
          {/* Header */}
          <Animated.View
            style={[styles.titleContainer, { opacity: titleAnim, transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons name="heart" size={48} color={Colors.accent} />
            </Animated.View>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchSubtitle}>
              You and {matchedUser.name} both want to play together
            </Text>
          </Animated.View>

          {/* Photos */}
          <Animated.View
            style={[styles.photosRow, { opacity: photosAnim, transform: [{ scale: photosAnim }] }]}
          >
            {/* Current User */}
            <View style={[styles.photoWrapper, styles.photoLeft]}>
              <Image source={{ uri: currentUser.photos[0] }} style={styles.photo} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.photoGradient}
              />
              <Text style={styles.photoName}>{currentUser.name.split(' ')[0]}</Text>
            </View>

            {/* Heart in center */}
            <View style={styles.centerHeart}>
              <Ionicons name="heart" size={24} color={Colors.white} />
            </View>

            {/* Matched User */}
            <View style={[styles.photoWrapper, styles.photoRight]}>
              <Image source={{ uri: matchedUser.photos[0] }} style={styles.photo} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.photoGradient}
              />
              <Text style={styles.photoName}>{matchedUser.name.split(' ')[0]}</Text>
            </View>
          </Animated.View>

          {/* Sports overlap hint */}
          <Animated.View style={[styles.commonSports, { opacity: buttonsAnim }]}>
            {matchedUser.sports.slice(0, 2).map((sport) => (
              <Text key={sport.id} style={styles.commonSportText}>
                {sport.emoji} {sport.name}
              </Text>
            ))}
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={[styles.buttons, { opacity: buttonsAnim, transform: [{ translateY: buttonsAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}
          >
            <AnimatedButton
              label="Send Message"
              onPress={onSendMessage}
              variant="secondary"
              fullWidth
              size="lg"
              icon={<Ionicons name="chatbubble-ellipses" size={20} color={Colors.white} />}
            />
            <TouchableOpacity onPress={onKeepSwiping} style={styles.keepSwipingBtn}>
              <Text style={styles.keepSwipingText}>Keep Swiping</Text>
              <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing['2xl'],
  },
  titleContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  matchTitle: {
    ...Typography.display,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  matchSubtitle: {
    ...Typography.bodyLarge,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
    lineHeight: 26,
  },
  photosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  photoWrapper: {
    width: 140,
    height: 160,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    ...Shadow.lg,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  photoLeft: {
    transform: [{ rotate: '-6deg' }, { translateX: 10 }],
    zIndex: 2,
  },
  photoRight: {
    transform: [{ rotate: '6deg' }, { translateX: -10 }],
    zIndex: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  photoName: {
    ...Typography.label,
    color: Colors.white,
    position: 'absolute',
    bottom: Spacing.sm,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontWeight: '700',
  },
  centerHeart: {
    zIndex: 10,
    backgroundColor: Colors.accent,
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
    ...Shadow.md,
  },
  commonSports: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  commonSportText: {
    ...Typography.label,
    color: Colors.white,
    fontWeight: '600',
  },
  buttons: {
    width: '100%',
    gap: Spacing.base,
    alignItems: 'center',
  },
  keepSwipingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  keepSwipingText: {
    ...Typography.labelLarge,
    color: 'rgba(255,255,255,0.8)',
  },
});
