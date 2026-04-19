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
import * as Haptics from 'expo-haptics';
import { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { ConfettiAnimation } from './ConfettiAnimation';
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
  const glowScale = useRef(new Animated.Value(0.9)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const ring2Scale = useRef(new Animated.Value(0.8)).current;
  const ring2Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    // Reset all
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    titleAnim.setValue(0);
    photosAnim.setValue(0);
    buttonsAnim.setValue(0);
    heartScale.setValue(0);
    glowScale.setValue(0.9);
    glowOpacity.setValue(0);
    ring2Scale.setValue(0.8);
    ring2Opacity.setValue(0);

    // Haptic burst — feels like a celebration
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).then(() => {
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 180);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 360);
    });

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 65,
        useNativeDriver: true,
      }),
      Animated.stagger(110, [
        Animated.spring(photosAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
        Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
        Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 80 }),
        Animated.spring(buttonsAnim, { toValue: 1, useNativeDriver: true, friction: 6 }),
      ]),
    ]).start();

    // Glow ring 1 pulse loop
    Animated.parallel([
      Animated.timing(glowOpacity, { toValue: 0.55, duration: 400, useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowScale, { toValue: 1.12, duration: 1100, useNativeDriver: true }),
          Animated.timing(glowScale, { toValue: 0.96, duration: 1100, useNativeDriver: true }),
        ])
      ),
    ]).start();

    // Glow ring 2 — slightly offset
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(ring2Opacity, { toValue: 0.32, duration: 400, useNativeDriver: true }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(ring2Scale, { toValue: 1.22, duration: 1400, useNativeDriver: true }),
            Animated.timing(ring2Scale, { toValue: 0.92, duration: 1400, useNativeDriver: true }),
          ])
        ),
      ]).start();
    }, 250);

    // Heart continuous pulse
    Animated.loop(
      Animated.sequence([
        Animated.spring(heartScale, { toValue: 1.28, useNativeDriver: true, friction: 3 }),
        Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, friction: 3 }),
      ])
    ).start();
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['rgba(79,195,247,0.97)', 'rgba(2,100,180,0.97)']}
          style={StyleSheet.absoluteFill}
        />

        {/* Confetti burst — on top of everything */}
        <ConfettiAnimation visible={visible} />

        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
          {/* Title */}
          <Animated.View
            style={[
              styles.titleContainer,
              {
                opacity: titleAnim,
                transform: [
                  {
                    translateY: titleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [22, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons name="heart" size={52} color="#FF3366" />
            </Animated.View>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchSubtitle}>
              You and {matchedUser.name.split(' ')[0]} both want to play together
            </Text>
          </Animated.View>

          {/* Photos with glow rings */}
          <Animated.View
            style={[
              styles.photosRow,
              { opacity: photosAnim, transform: [{ scale: photosAnim }] },
            ]}
          >
            {/* Glow ring 2 (outer) */}
            <Animated.View
              style={[
                styles.glowRing,
                styles.glowRingOuter,
                { transform: [{ scale: ring2Scale }], opacity: ring2Opacity },
              ]}
            />
            {/* Glow ring 1 (inner) */}
            <Animated.View
              style={[
                styles.glowRing,
                styles.glowRingInner,
                { transform: [{ scale: glowScale }], opacity: glowOpacity },
              ]}
            />

            <View style={[styles.photoWrapper, styles.photoLeft]}>
              <Image source={{ uri: currentUser.photos[0] }} style={styles.photo} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.photoGradient}
              />
              <Text style={styles.photoName}>{currentUser.name.split(' ')[0]}</Text>
            </View>

            <View style={styles.centerHeart}>
              <Ionicons name="heart" size={24} color={Colors.white} />
            </View>

            <View style={[styles.photoWrapper, styles.photoRight]}>
              <Image source={{ uri: matchedUser.photos[0] }} style={styles.photo} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.photoGradient}
              />
              <Text style={styles.photoName}>{matchedUser.name.split(' ')[0]}</Text>
            </View>
          </Animated.View>

          {/* Common sports pill */}
          <Animated.View style={[styles.commonSports, { opacity: buttonsAnim }]}>
            {matchedUser.sports.slice(0, 2).map((sport) => (
              <Text key={sport.id} style={styles.commonSportText}>
                {sport.emoji} {sport.name}
              </Text>
            ))}
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={[
              styles.buttons,
              {
                opacity: buttonsAnim,
                transform: [
                  {
                    translateY: buttonsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [32, 0],
                    }),
                  },
                ],
              },
            ]}
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
              <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.75)" />
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
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  matchTitle: {
    ...Typography.display,
    color: Colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    borderRadius: 9999,
  },
  glowRingInner: {
    width: 260,
    height: 180,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(79,195,247,0.06)',
    borderRadius: 100,
  },
  glowRingOuter: {
    width: 320,
    height: 220,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'transparent',
    borderRadius: 110,
  },
  photoWrapper: {
    width: 140,
    height: 162,
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
    backgroundColor: '#FF3366',
    width: 46,
    height: 46,
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
    color: 'rgba(255,255,255,0.78)',
  },
});
