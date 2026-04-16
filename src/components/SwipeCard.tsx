import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { User } from '../types';
import { SportBadge } from './SportBadge';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const CARD_WIDTH = SCREEN_WIDTH - 20;
export const CARD_HEIGHT = SCREEN_HEIGHT * 0.72;

interface SwipeCardProps {
  user: User;
  isTop: boolean;
  style?: object;
  panHandlers?: object;
  likeOpacity?: Animated.AnimatedInterpolation<string | number>;
  nopeOpacity?: Animated.AnimatedInterpolation<string | number>;
  onInfoPress?: () => void;
  /**
   * When provided, this overrides the internal photoIndex state.
   * Use this on the top card so HomeScreen (via panResponder tap) can drive navigation.
   */
  photoIndex?: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  isTop,
  style,
  panHandlers,
  likeOpacity,
  nopeOpacity,
  onInfoPress,
  photoIndex,
}) => {
  // Internal state as fallback — only used when photoIndex prop is not provided
  const [internalIndex, setInternalIndex] = useState(0);

  useEffect(() => {
    setInternalIndex(0);
  }, [user.id]);

  const activeIndex = photoIndex !== undefined ? photoIndex : internalIndex;

  return (
    <Animated.View style={[styles.card, style]} {...(isTop ? panHandlers : {})}>
      {/* Photo */}
      <Image
        source={{ uri: user.photos[activeIndex] }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Photo progress dots */}
      {user.photos.length > 1 && (
        <View style={styles.dotsContainer} pointerEvents="none">
          {user.photos.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}

      {/* LIKE stamp */}
      {likeOpacity && (
        <Animated.View
          style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}
          pointerEvents="none"
        >
          <Text style={styles.stampText}>LIKE</Text>
          <Ionicons name="heart" size={22} color={Colors.white} />
        </Animated.View>
      )}

      {/* NOPE stamp */}
      {nopeOpacity && (
        <Animated.View
          style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}
          pointerEvents="none"
        >
          <Ionicons name="close" size={22} color={Colors.white} />
          <Text style={styles.stampText}>NOPE</Text>
        </Animated.View>
      )}

      {/*
        Gradient panel — no pointerEvents="none" so the info button works.
        All text/badge rows are pointerEvents="none" so touches pass through to the card.
      */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.88)']}
        style={styles.gradient}
      >
        <View style={styles.badgeRow} pointerEvents="none">
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={13} color={Colors.primaryLight} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcons name="crown" size={13} color={Colors.secondary} />
            </View>
          )}
        </View>

        <View style={styles.nameRow} pointerEvents="none">
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age}</Text>
        </View>

        <View style={styles.distRow} pointerEvents="none">
          <Ionicons name="location-outline" size={13} color={Colors.primaryLight} />
          <Text style={styles.distText}>
            {user.distance < 1
              ? `${(user.distance * 1000).toFixed(0)}m away`
              : `${user.distance.toFixed(1)} km away`}
          </Text>
        </View>

        <View style={styles.sportsRow} pointerEvents="none">
          {user.sports.slice(0, 3).map((sport) => (
            <SportBadge key={sport.id} sport={sport} size="sm" variant="ghost" />
          ))}
        </View>

        <View style={styles.bioRow}>
          <Text style={styles.bio} numberOfLines={2} pointerEvents="none">
            {user.bio}
          </Text>
          {onInfoPress && (
            <TouchableOpacity
              onPress={onInfoPress}
              style={styles.infoBtn}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
            >
              <View style={styles.infoBtnInner}>
                <Ionicons name="information-circle" size={26} color={Colors.white} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    backgroundColor: Colors.surfaceAlt,
    ...Shadow.card,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },
  dotsContainer: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  stamp: {
    position: 'absolute',
    top: Spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2.5,
  },
  likeStamp: {
    left: Spacing.xl,
    backgroundColor: 'rgba(79,195,247,0.82)',
    borderColor: Colors.white,
    transform: [{ rotate: '-12deg' }],
  },
  nopeStamp: {
    right: Spacing.xl,
    backgroundColor: 'rgba(255,82,82,0.82)',
    borderColor: Colors.white,
    transform: [{ rotate: '12deg' }],
  },
  stampText: {
    ...Typography.h4,
    color: Colors.white,
    letterSpacing: 2,
    fontWeight: '800',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing['5xl'],
    gap: Spacing.sm,
  },
  badgeRow: { flexDirection: 'row', gap: Spacing.sm },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  verifiedText: {
    ...Typography.caption,
    color: Colors.primaryLight,
    fontWeight: '600',
    fontSize: 10,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,152,0,0.2)',
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
  name: { ...Typography.h1, color: Colors.white, fontWeight: '700' },
  age: { ...Typography.h3, color: 'rgba(255,255,255,0.85)', fontWeight: '400' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distText: { ...Typography.bodySmall, color: Colors.primaryLight, fontWeight: '500' },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  bioRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  bio: { flex: 1, ...Typography.bodySmall, color: 'rgba(255,255,255,0.82)', lineHeight: 19 },
  infoBtn: { opacity: 0.95 },
  infoBtnInner: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.full,
    padding: 2,
  },
});
