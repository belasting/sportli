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

// Larger card for edge-to-edge feel
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
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  user,
  isTop,
  style,
  panHandlers,
  likeOpacity,
  nopeOpacity,
  onInfoPress,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  // Reset photo index when the user card changes — fixes the "stuck photo" bug
  useEffect(() => {
    setPhotoIndex(0);
  }, [user.id]);

  const handlePhotoTap = (side: 'left' | 'right') => {
    if (side === 'right' && photoIndex < user.photos.length - 1) {
      setPhotoIndex((i) => i + 1);
    } else if (side === 'left' && photoIndex > 0) {
      setPhotoIndex((i) => i - 1);
    }
  };

  return (
    <Animated.View style={[styles.card, style]} {...(isTop ? panHandlers : {})}>
      {/* Photo */}
      <Image
        source={{ uri: user.photos[photoIndex] }}
        style={styles.photo}
        resizeMode="cover"
      />

      {/* Photo tap areas — work now because pan responder uses onMoveShouldSetPanResponder */}
      <View style={styles.tapContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.tapLeft}
          onPress={() => handlePhotoTap('left')}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={styles.tapRight}
          onPress={() => handlePhotoTap('right')}
          activeOpacity={1}
        />
      </View>

      {/* Photo progress bar dots */}
      {user.photos.length > 1 && (
        <View style={styles.dotsContainer}>
          {user.photos.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === photoIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}

      {/* LIKE stamp overlay */}
      {likeOpacity && (
        <Animated.View style={[styles.stamp, styles.likeStamp, { opacity: likeOpacity }]}>
          <Text style={styles.stampText}>LIKE</Text>
          <Ionicons name="heart" size={22} color={Colors.white} />
        </Animated.View>
      )}

      {/* NOPE stamp overlay */}
      {nopeOpacity && (
        <Animated.View style={[styles.stamp, styles.nopeStamp, { opacity: nopeOpacity }]}>
          <Ionicons name="close" size={22} color={Colors.white} />
          <Text style={styles.stampText}>NOPE</Text>
        </Animated.View>
      )}

      {/* Gradient info panel */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.18)', 'rgba(0,0,0,0.88)']}
        style={styles.gradient}
        pointerEvents="none"
      >
        {/* Badges row */}
        <View style={styles.badgeRow}>
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

        {/* Name + age */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age}</Text>
        </View>

        {/* Distance */}
        <View style={styles.distRow}>
          <Ionicons name="location-outline" size={13} color={Colors.primaryLight} />
          <Text style={styles.distText}>
            {user.distance < 1
              ? `${(user.distance * 1000).toFixed(0)}m away`
              : `${user.distance.toFixed(1)} km away`}
          </Text>
        </View>

        {/* Sports */}
        <View style={styles.sportsRow}>
          {user.sports.slice(0, 3).map((sport) => (
            <SportBadge key={sport.id} sport={sport} size="sm" variant="ghost" />
          ))}
        </View>

        {/* Bio + info button */}
        <View style={styles.bioRow}>
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
          {onInfoPress && (
            <TouchableOpacity
              onPress={onInfoPress}
              style={styles.infoBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
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
  tapContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  tapLeft: { flex: 1 },
  tapRight: { flex: 1 },
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
  verifiedText: { ...Typography.caption, color: Colors.primaryLight, fontWeight: '600', fontSize: 10 },
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
