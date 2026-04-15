import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_USERS, CURRENT_USER } from '../data/mockUsers';
import { RootStackParamList } from '../types';
import { SwipeCard, CARD_WIDTH, CARD_HEIGHT } from '../components/SwipeCard';
import { ActionButton } from '../components/ActionButton';
import { MatchModal } from '../components/MatchModal';
import { FilterModal, FilterState } from '../components/FilterModal';
import { ToastNotification, ToastType } from '../components/ToastNotification';
import { useSwipeAnimation } from '../hooks/useSwipeAnimation';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { User } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SAFE_TOP = Platform.OS === 'ios' ? 54 : 38;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    maxDistance: 25,
    selectedSports: [],
    skillLevel: null,
    city: '',
  });

  // Toast notification state
  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    userName: string;
    userPhoto: string;
  }>({ visible: false, type: 'like', userName: '', userPhoto: '' });

  const triggerMatch = (user: User) => {
    if (Math.random() > 0.55) {
      setMatchedUser(user);
      setTimeout(() => setShowMatch(true), 300);
    } else {
      // Show a "like" toast for non-matches
      setToast({ visible: true, type: 'like', userName: user.name, userPhoto: user.photos[0] });
    }
  };

  const handleSwipeRight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const swiped = users[users.length - 1];
    setLikeCount((c) => c + 1);
    setUsers((prev) => prev.slice(0, -1));
    if (swiped) triggerMatch(swiped);
  };

  const handleSwipeLeft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUsers((prev) => prev.slice(0, -1));
  };

  const { panResponder, getCardStyle, getLikeOpacity, getNopeOpacity, getNextCardScale, forceSwipe } =
    useSwipeAnimation({ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight });

  const handleReset = () => {
    setUsers(MOCK_USERS);
    setLikeCount(0);
  };

  const hasActiveFilters =
    activeFilters.selectedSports.length > 0 ||
    activeFilters.skillLevel !== null ||
    activeFilters.maxDistance !== 25 ||
    !!activeFilters.city;

  const renderCards = () => {
    if (users.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏃</Text>
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptySubtitle}>Check back later or expand your filters</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={18} color={Colors.primary} />
            <Text style={styles.resetBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return users
      .slice(Math.max(0, users.length - 3), users.length)
      .map((user, index, arr) => {
        const isTop = index === arr.length - 1;
        const isSecond = index === arr.length - 2;

        if (isTop) {
          return (
            <SwipeCard
              key={user.id}
              user={user}
              isTop
              style={[styles.card, getCardStyle()]}
              panHandlers={panResponder.panHandlers}
              likeOpacity={getLikeOpacity()}
              nopeOpacity={getNopeOpacity()}
              onInfoPress={() => navigation.navigate('UserProfile', { user })}
            />
          );
        }

        return (
          <Animated.View
            key={user.id}
            style={[
              styles.cardWrapper,
              isSecond && { transform: [{ scale: getNextCardScale() }] },
              !isSecond && { transform: [{ scale: 0.90 }] },
            ]}
          >
            <SwipeCard user={user} isTop={false} style={styles.card} />
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Edge-to-edge card area */}
      <View style={styles.cardsArea}>
        {renderCards()}

        {/* Floating top overlay — title + filter button */}
        <View style={styles.topOverlay} pointerEvents="box-none">
          {/* Like counter pill */}
          <View style={styles.likeCountPill}>
            <Ionicons name="heart" size={12} color={Colors.accent} />
            <Text style={styles.likeCountText}>{likeCount}</Text>
          </View>

          {/* App name */}
          <Text style={styles.floatingTitle}>sportli</Text>

          {/* Glass filter button */}
          <TouchableOpacity
            style={[styles.glassBtn, hasActiveFilters && styles.glassBtnActive]}
            onPress={() => setShowFilter(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name="options-outline"
              size={19}
              color={hasActiveFilters ? Colors.white : Colors.textPrimary}
            />
            {hasActiveFilters && <View style={styles.filterActiveDot} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Action buttons */}
      {users.length > 0 && (
        <View style={styles.actionsBar}>
          {/* Undo */}
          <ActionButton variant="neutral" size="sm" onPress={() => {}}>
            <Ionicons name="arrow-undo" size={20} color={Colors.secondary} />
          </ActionButton>

          {/* Nope */}
          <ActionButton
            variant="nope"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('left');
            }}
          >
            <Ionicons name="close" size={34} color={Colors.white} />
          </ActionButton>

          {/* Super Like */}
          <ActionButton variant="super" size="sm" onPress={() => {}}>
            <Ionicons name="star" size={20} color={Colors.white} />
          </ActionButton>

          {/* Like */}
          <ActionButton
            variant="like"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('right');
            }}
          >
            <Ionicons name="heart" size={30} color={Colors.white} />
          </ActionButton>

          {/* Boost */}
          <ActionButton variant="neutral" size="sm" onPress={() => {}}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={Colors.primary} />
          </ActionButton>
        </View>
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        initial={activeFilters}
        onClose={() => setShowFilter(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          setShowFilter(false);
        }}
      />

      {/* Match Modal */}
      {matchedUser && (
        <MatchModal
          visible={showMatch}
          currentUser={CURRENT_USER}
          matchedUser={matchedUser}
          onSendMessage={() => {
            setShowMatch(false);
            setMatchedUser(null);
          }}
          onKeepSwiping={() => {
            setShowMatch(false);
            setMatchedUser(null);
          }}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification
        visible={toast.visible}
        type={toast.type}
        userName={toast.userName}
        userPhoto={toast.userPhoto}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1117',
  },

  // Cards area — takes all space above action bar
  cardsArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
  },
  cardWrapper: {
    position: 'absolute',
  },

  // Floating top overlay
  topOverlay: {
    position: 'absolute',
    top: SAFE_TOP,
    left: Spacing['2xl'],
    right: Spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  likeCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    ...Shadow.sm,
  },
  likeCountText: { ...Typography.caption, color: Colors.accent, fontWeight: '800' },
  floatingTitle: {
    ...Typography.h3,
    color: Colors.white,
    fontWeight: '800',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  glassBtn: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: BorderRadius.lg,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.6)',
    ...Shadow.sm,
    position: 'relative',
  },
  glassBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },

  // Action buttons bar
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.xl,
    backgroundColor: '#0F1117',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing['2xl'],
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { ...Typography.h2, color: Colors.white, textAlign: 'center' },
  emptySubtitle: { ...Typography.body, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    backgroundColor: 'rgba(79,195,247,0.15)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  resetBtnText: { ...Typography.labelLarge, color: Colors.primary },
});
