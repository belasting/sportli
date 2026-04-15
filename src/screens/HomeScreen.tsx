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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_USERS, CURRENT_USER } from '../data/mockUsers';
import { SwipeCard } from '../components/SwipeCard';
import { ActionButton } from '../components/ActionButton';
import { MatchModal } from '../components/MatchModal';
import { FilterModal } from '../components/FilterModal';
import { ToastNotification } from '../components/ToastNotification';
import { useSwipeAnimation } from '../hooks/useSwipeAnimation';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';
import { User, RootStackParamList, FilterState } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const DEFAULT_FILTERS: FilterState = {
  maxDistance: 50,
  selectedSports: [],
  skillLevel: null,
  city: null,
};

const activeFilterCount = (f: FilterState) =>
  (f.maxDistance < 50 ? 1 : 0) +
  (f.selectedSports.length > 0 ? 1 : 0) +
  (f.skillLevel ? 1 : 0) +
  (f.city ? 1 : 0);

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toast, setToast] = useState<{ message: string; type: 'like' | 'nope' | 'match' } | null>(null);

  const showToast = (message: string, type: 'like' | 'nope' | 'match') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2200);
  };

  const triggerMatch = (user: User) => {
    if (Math.random() > 0.6) {
      setMatchedUser(user);
      setTimeout(() => {
        setShowMatch(true);
        showToast(`You matched with ${user.name.split(' ')[0]}!`, 'match');
      }, 300);
    }
  };

  const handleSwipeRight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const swiped = users[users.length - 1];
    setLikeCount((c) => c + 1);
    setUsers((prev) => prev.slice(0, -1));
    if (swiped) {
      showToast(`Liked ${swiped.name.split(' ')[0]}!`, 'like');
      triggerMatch(swiped);
    }
  };

  const handleSwipeLeft = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const swiped = users[users.length - 1];
    setUsers((prev) => prev.slice(0, -1));
    if (swiped) showToast(`Passed on ${swiped.name.split(' ')[0]}`, 'nope');
  };

  const { position, panResponder, getCardStyle, getLikeOpacity, getNopeOpacity, getNextCardScale, forceSwipe } =
    useSwipeAnimation({ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight });

  const handleReset = () => {
    setUsers(MOCK_USERS);
    setLikeCount(0);
  };

  const numActiveFilters = activeFilterCount(filters);

  const renderCards = () => {
    if (users.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="emoticon-happy-outline" size={72} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptySubtitle}>Come back later or adjust your filters</Text>
          <TouchableOpacity style={styles.emptyResetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.emptyResetText}>Start over</Text>
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
              isSecond
                ? { transform: [{ scale: getNextCardScale() }] }
                : { transform: [{ scale: 0.88 }] },
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

      {/* Full-screen cards area */}
      <View style={styles.cardsContainer}>
        {renderCards()}

        {/* Glass overlay header */}
        <View style={styles.glassHeader} pointerEvents="box-none">
          <View style={styles.glassHeaderInner} pointerEvents="auto">
            {/* Logo */}
            <View style={styles.logoRow}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.logoMini}
              >
                <MaterialCommunityIcons name="lightning-bolt" size={16} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.headerTitle}>Sportli</Text>
            </View>

            {/* Right controls */}
            <View style={styles.headerRight}>
              {likeCount > 0 && (
                <View style={styles.likeCounter}>
                  <Ionicons name="heart" size={12} color={Colors.accent} />
                  <Text style={styles.likeCountText}>{likeCount}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.filterBtn, numActiveFilters > 0 && styles.filterBtnActive]}
                onPress={() => setShowFilter(true)}
              >
                <Ionicons
                  name="options-outline"
                  size={19}
                  color={numActiveFilters > 0 ? Colors.white : Colors.white}
                />
                {numActiveFilters > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{numActiveFilters}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Active filter chips */}
          {numActiveFilters > 0 && (
            <View style={styles.activeFiltersRow} pointerEvents="auto">
              {filters.maxDistance < 50 && (
                <View style={styles.filterChip}>
                  <Ionicons name="location" size={11} color={Colors.primary} />
                  <Text style={styles.filterChipText}>≤{filters.maxDistance}km</Text>
                </View>
              )}
              {filters.city && (
                <View style={styles.filterChip}>
                  <Ionicons name="business" size={11} color={Colors.primary} />
                  <Text style={styles.filterChipText}>{filters.city}</Text>
                </View>
              )}
              {filters.selectedSports.length > 0 && (
                <View style={styles.filterChip}>
                  <Ionicons name="football" size={11} color={Colors.primary} />
                  <Text style={styles.filterChipText}>
                    {filters.selectedSports.length} sport{filters.selectedSports.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {filters.skillLevel && (
                <View style={styles.filterChip}>
                  <Ionicons name="trophy" size={11} color={Colors.primary} />
                  <Text style={styles.filterChipText}>{filters.skillLevel}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setFilters(DEFAULT_FILTERS)}>
                <Text style={styles.clearFilters}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Toast */}
        {toast && <ToastNotification message={toast.message} type={toast.type} />}
      </View>

      {/* Action buttons */}
      {users.length > 0 && (
        <View style={styles.actions}>
          <ActionButton variant="neutral" size="sm" onPress={() => {}}>
            <Ionicons name="arrow-undo" size={20} color={Colors.secondary} />
          </ActionButton>

          <ActionButton
            variant="nope"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('left');
            }}
          >
            <Ionicons name="close" size={34} color={Colors.accent} />
          </ActionButton>

          <ActionButton variant="super" size="sm" onPress={() => {}}>
            <Ionicons name="star" size={20} color={Colors.secondary} />
          </ActionButton>

          <ActionButton
            variant="like"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('right');
            }}
          >
            <Ionicons name="heart" size={32} color={Colors.primary} />
          </ActionButton>

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
          onSendMessage={() => { setShowMatch(false); setMatchedUser(null); }}
          onKeepSwiping={() => { setShowMatch(false); setMatchedUser(null); }}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilter}
        current={filters}
        onApply={(f) => setFilters(f)}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
};

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 54 : 32;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
  },
  card: { position: 'absolute' },
  cardWrapper: { position: 'absolute' },

  // Glass header floating over cards
  glassHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  glassHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  logoMini: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.white,
    letterSpacing: -0.5,
    fontWeight: '800',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  likeCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  likeCountText: { ...Typography.label, color: Colors.white, fontWeight: '700' },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.3)',
  },
  filterBadgeText: { fontSize: 9, color: Colors.white, fontWeight: '800' },

  activeFiltersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.25)',
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  filterChipText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  clearFilters: { ...Typography.caption, color: 'rgba(255,255,255,0.75)', textDecorationLine: 'underline' },

  // Action buttons
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 28 : Spacing.xl,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  // Empty state
  emptyState: { alignItems: 'center', gap: Spacing.base, paddingHorizontal: Spacing['2xl'] },
  emptyTitle: { ...Typography.h2, color: Colors.white, textAlign: 'center' },
  emptySubtitle: { ...Typography.body, color: 'rgba(255,255,255,0.65)', textAlign: 'center' },
  emptyResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  emptyResetText: { ...Typography.labelLarge, color: Colors.white },
});
