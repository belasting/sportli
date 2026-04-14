import React, { useState } from 'react';
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

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HEIGHT = Dimensions.get('window').height * 0.68;

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

  const handlePhotoTap = (side: 'left' | 'right') => {
    if (side === 'right' && photoIndex < user.photos.length - 1) {
      setPhotoIndex(photoIndex + 1);
    } else if (side === 'left' && photoIndex > 0) {
      setPhotoIndex(photoIndex - 1);
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

      {/* Photo tap areas */}
      <View style={styles.tapContainer}>
        <TouchableOpacity style={styles.tapLeft} onPress={() => handlePhotoTap('left')} />
        <TouchableOpacity style={styles.tapRight} onPress={() => handlePhotoTap('right')} />
      </View>

      {/* Photo dots */}
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

      {/* LIKE overlay */}
      {likeOpacity && (
        <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
          <Text style={styles.overlayText}>LIKE</Text>
          <Ionicons name="heart" size={32} color={Colors.white} />
        </Animated.View>
      )}

      {/* NOPE overlay */}
      {nopeOpacity && (
        <Animated.View style={[styles.overlay, styles.nopeOverlay, { opacity: nopeOpacity }]}>
          <Ionicons name="close" size={32} color={Colors.white} />
          <Text style={styles.overlayText}>NOPE</Text>
        </Animated.View>
      )}

      {/* Gradient info panel */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.92)']}
        style={styles.gradient}
        pointerEvents="none"
      >
        {/* Verified + Premium badges */}
        <View style={styles.badgeRow}>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.primary} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
          {user.isPremium && (
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcons name="crown" size={14} color={Colors.secondary} />
            </View>
          )}
        </View>

        {/* Name + Age */}
        <View style={styles.nameRow}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age}</Text>
        </View>

        {/* Distance */}
        <View style={styles.distanceRow}>
          <Ionicons name="location-outline" size={14} color={Colors.primaryLight} />
          <Text style={styles.distanceText}>
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

        {/* Bio + info button row */}
        <View style={styles.bioRow}>
          <Text style={styles.bio} numberOfLines={2}>
            {user.bio}
          </Text>
          {onInfoPress && (
            <TouchableOpacity onPress={onInfoPress} style={styles.infoBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="information-circle" size={30} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SCREEN_WIDTH - Spacing['2xl'],
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
    top: Spacing.base,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: Colors.white,
  },
  overlay: {
    position: 'absolute',
    top: Spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 3,
  },
  likeOverlay: {
    left: Spacing.xl,
    backgroundColor: Colors.likeOverlay,
    borderColor: Colors.white,
    transform: [{ rotate: '-15deg' }],
  },
  nopeOverlay: {
    right: Spacing.xl,
    backgroundColor: Colors.nopeOverlay,
    borderColor: Colors.white,
    transform: [{ rotate: '15deg' }],
  },
  overlayText: {
    ...Typography.h3,
    color: Colors.white,
    letterSpacing: 2,
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
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
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
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,152,0,0.2)',
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  name: {
    ...Typography.h2,
    color: Colors.white,
  },
  age: {
    ...Typography.h3,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    ...Typography.bodySmall,
    color: Colors.primaryLight,
    fontWeight: '500',
  },
  sportsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  bioRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  bio: {
    flex: 1,
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 18,
  },
  infoBtn: {
    opacity: 0.9,
  },
});
