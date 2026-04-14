import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { RootStackParamList } from '../types';
import { SportBadge } from '../components/SportBadge';
import { AnimatedButton } from '../components/AnimatedButton';
import { CURRENT_USER } from '../data/mockUsers';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;
  route: RouteProp<RootStackParamList, 'UserProfile'>;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const SKILL_COLORS: Record<string, string> = {
  Beginner: Colors.success,
  Intermediate: Colors.primary,
  Advanced: Colors.secondary,
  Pro: Colors.accent,
};

export const UserProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user, fromMatch } = route.params;
  const [photoIndex, setPhotoIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const heartAnim = useRef(new Animated.Value(1)).current;

  const commonSports = user.sports.filter((s) =>
    CURRENT_USER.sports.some((cs) => cs.id === s.id)
  );

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiked(true);
    Animated.sequence([
      Animated.spring(heartAnim, { toValue: 1.4, useNativeDriver: true, friction: 3 }),
      Animated.spring(heartAnim, { toValue: 1, useNativeDriver: true, friction: 3 }),
    ]).start();
  };

  const handleMessage = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color={Colors.white} />
      </TouchableOpacity>

      {/* Floating action row top-right */}
      <View style={styles.topActions}>
        <TouchableOpacity style={styles.topActionBtn}>
          <Ionicons name="share-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topActionBtn}>
          <Ionicons name="flag-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo gallery */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: user.photos[photoIndex] }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />

          {/* Gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.photoGradient}
            pointerEvents="none"
          />

          {/* Photo dots */}
          {user.photos.length > 1 && (
            <View style={styles.photoDots}>
              {user.photos.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setPhotoIndex(i)}
                  style={[styles.dot, i === photoIndex && styles.dotActive]}
                />
              ))}
            </View>
          )}

          {/* Photo tap areas */}
          <View style={styles.photoTapRow}>
            <TouchableOpacity
              style={styles.photoTapArea}
              onPress={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
            />
            <TouchableOpacity
              style={styles.photoTapArea}
              onPress={() => setPhotoIndex(Math.min(user.photos.length - 1, photoIndex + 1))}
            />
          </View>

          {/* Name overlay on photo */}
          <View style={styles.photoOverlayInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userAge}>{user.age}</Text>
              {user.isVerified && (
                <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              )}
              {user.isPremium && (
                <MaterialCommunityIcons name="crown" size={20} color={Colors.secondary} />
              )}
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.locationText}>
                {user.location} · {user.distance < 1
                  ? `${(user.distance * 1000).toFixed(0)}m away`
                  : `${user.distance.toFixed(1)} km away`}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Common sports banner */}
          {commonSports.length > 0 && (
            <View style={styles.commonBanner}>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.secondary} />
              <Text style={styles.commonBannerText}>
                You both play {commonSports.map(s => s.name).join(' & ')}!
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.nopeBtn]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color={Colors.accent} />
            </TouchableOpacity>

            <AnimatedButton
              label="Send Message"
              onPress={handleMessage}
              variant="primary"
              size="md"
              style={{ flex: 1 }}
              icon={<Ionicons name="chatbubble-ellipses" size={16} color={Colors.white} />}
            />

            <TouchableOpacity
              style={[styles.actionBtn, styles.likeBtn, liked && styles.likeBtnActive]}
              onPress={handleLike}
            >
              <Animated.View style={{ transform: [{ scale: heartAnim }] }}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={28}
                  color={liked ? Colors.white : Colors.accent}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Bio */}
          {user.bio ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          ) : null}

          {/* Sports */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sports</Text>
            <View style={styles.sportsGrid}>
              {user.sports.map((sport) => {
                const isCommon = commonSports.some((s) => s.id === sport.id);
                return (
                  <View key={sport.id} style={[styles.sportCard, isCommon && styles.sportCardCommon]}>
                    <Text style={styles.sportEmoji}>{sport.emoji}</Text>
                    <Text style={styles.sportName}>{sport.name}</Text>
                    {isCommon && (
                      <View style={styles.commonBadge}>
                        <Text style={styles.commonBadgeText}>Common</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Skill level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Level</Text>
            <View style={styles.skillRow}>
              {(['Beginner', 'Intermediate', 'Advanced', 'Pro'] as const).map((level) => {
                const isActive = user.skillLevel === level;
                return (
                  <View
                    key={level}
                    style={[
                      styles.skillChip,
                      isActive && {
                        backgroundColor: SKILL_COLORS[level],
                        borderColor: SKILL_COLORS[level],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        isActive && styles.skillChipTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When They Play</Text>
            <View style={styles.daysRow}>
              {DAYS.map((day) => {
                const active = user.availability.days.includes(day);
                return (
                  <View
                    key={day}
                    style={[styles.dayChip, active && styles.dayChipActive]}
                  >
                    <Text style={[styles.dayText, active && styles.dayTextActive]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
            {user.availability.timeSlots.length > 0 && (
              <View style={styles.timeSlotsRow}>
                {user.availability.timeSlots.map((slot) => (
                  <View key={slot} style={styles.timeSlot}>
                    <Text style={styles.timeSlotText}>{slot}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Stats row */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="map-marker-distance" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>
                {user.distance < 1
                  ? `${(user.distance * 1000).toFixed(0)}m`
                  : `${user.distance.toFixed(1)}km`}
              </Text>
              <Text style={styles.statLabel}>Away</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="dumbbell" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{user.sports.length}</Text>
              <Text style={styles.statLabel}>Sports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>{user.availability.days.length}</Text>
              <Text style={styles.statLabel}>Days/wk</Text>
            </View>
          </View>

          {/* Safety section */}
          <View style={styles.safetyCard}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
            <Text style={styles.safetyText}>
              {user.isVerified
                ? 'This profile is verified by Sportli'
                : 'Report or block this user if something feels off'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },

  // Floating buttons
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 44,
    left: Spacing['2xl'],
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 44,
    right: Spacing['2xl'],
    zIndex: 10,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  topActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Photo
  photoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.58,
    position: 'relative',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
  photoDots: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 42,
    left: 72,
    right: 72,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    width: 18,
  },
  photoTapRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  photoTapArea: { flex: 1 },
  photoOverlayInfo: {
    position: 'absolute',
    bottom: Spacing.xl,
    left: Spacing['2xl'],
    right: Spacing['2xl'],
    gap: Spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  userName: {
    ...Typography.h1,
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  userAge: {
    ...Typography.h2,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '400',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.82)',
  },

  // Content
  content: {
    padding: Spacing['2xl'],
    gap: Spacing.xl,
  },

  // Common sports banner
  commonBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.secondaryLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary,
  },
  commonBannerText: {
    ...Typography.labelLarge,
    color: Colors.secondary,
    flex: 1,
  },

  // Action buttons
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...Shadow.md,
  },
  nopeBtn: {
    backgroundColor: Colors.white,
    borderColor: Colors.accent,
  },
  likeBtn: {
    backgroundColor: Colors.white,
    borderColor: Colors.accent,
  },
  likeBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  // Sections
  section: { gap: Spacing.md },
  sectionTitle: { ...Typography.h4, color: Colors.textPrimary },

  bioText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 26,
  },

  // Sports grid
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  sportCard: {
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    minWidth: 80,
    ...Shadow.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  sportCardCommon: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryLight,
  },
  sportEmoji: { fontSize: 28 },
  sportName: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
  commonBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  commonBadgeText: { fontSize: 8, color: Colors.white, fontWeight: '800' },

  // Skill level
  skillRow: { flexDirection: 'row', gap: Spacing.sm },
  skillChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  skillChipText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  skillChipTextActive: { color: Colors.white },

  // Availability
  daysRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  dayChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  dayTextActive: { color: Colors.white },
  timeSlotsRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', marginTop: 4 },
  timeSlot: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  timeSlotText: { ...Typography.caption, color: Colors.primaryDark, fontWeight: '600' },

  // Stats card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { ...Typography.h3, color: Colors.textPrimary, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: Colors.textMuted },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },

  // Safety
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  safetyText: { ...Typography.bodySmall, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
});
