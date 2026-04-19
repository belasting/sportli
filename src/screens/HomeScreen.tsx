import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { PromoNotification, PROMO_MESSAGES, PromoConfig } from '../components/PromoNotification';
import { RewardToast, RewardType } from '../components/RewardToast';
import { EmptyState } from '../components/EmptyState';
import { useSwipeAnimation } from '../hooks/useSwipeAnimation';
import { useRetention } from '../hooks/useRetention';
import { useTheme } from '../context/ThemeContext';
import { Colors, Spacing, BorderRadius } from '../theme';
import { User, RootStackParamList, FilterState } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 54 : 32;

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
  const { colors } = useTheme();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toast, setToast] = useState<{ message: string; type: 'like' | 'nope' | 'match' } | null>(null);
  const [promo, setPromo] = useState<PromoConfig | null>(null);
  const [rewardToast, setRewardToast] = useState<{ type: RewardType; streakCount?: number } | null>(null);

  const swipeCountRef = useRef(0);
  const lastPromoIdRef = useRef<string | null>(null);
  const rewardShownRef = useRef(false);

  const { streak, isFirstToday, showFirstMatchReward, markFirstMatch } = useRetention();

  useEffect(() => {
    if (!isFirstToday || rewardShownRef.current) return;
    rewardShownRef.current = true;
    const timer = setTimeout(() => {
      if (streak >= 2) {
        setRewardToast({ type: 'streak', streakCount: streak });
      } else {
        setRewardToast({ type: 'daily_login' });
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, [isFirstToday, streak]);

  useEffect(() => {
    if (showFirstMatchReward) {
      setRewardToast({ type: 'first_match' });
    }
  }, [showFirstMatchReward]);

  const maybeShowPromo = useCallback(() => {
    swipeCountRef.current += 1;
    if (swipeCountRef.current % 4 === 0 && !promo) {
      const msgs = PROMO_MESSAGES.filter((p) => p.id !== lastPromoIdRef.current);
      const pick = msgs[Math.floor(Math.random() * msgs.length)];
      lastPromoIdRef.current = pick.id;
      setTimeout(() => setPromo(pick), 800);
    }
  }, [promo]);

  const showToast = useCallback(
    (message: string, type: 'like' | 'nope' | 'match') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 2200);
    },
    []
  );

  const triggerMatch = useCallback(
    (user: User) => {
      if (Math.random() > 0.6) {
        setMatchedUser(user);
        markFirstMatch();
        setTimeout(() => {
          setShowMatch(true);
          showToast(`You matched with ${user.name.split(' ')[0]}!`, 'match');
        }, 300);
      }
    },
    [markFirstMatch, showToast]
  );

  const handleSwipeRight = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUsers((prev) => {
      const swiped = prev[prev.length - 1];
      if (swiped) {
        showToast(`Liked ${swiped.name.split(' ')[0]}! ❤️`, 'like');
        setLikeCount((c) => c + 1);
        triggerMatch(swiped);
      }
      return prev.slice(0, -1);
    });
    maybeShowPromo();
  }, [maybeShowPromo, showToast, triggerMatch]);

  const handleSwipeLeft = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUsers((prev) => {
      const swiped = prev[prev.length - 1];
      if (swiped) showToast('Passed', 'nope');
      return prev.slice(0, -1);
    });
    maybeShowPromo();
  }, [maybeShowPromo, showToast]);

  const { panResponder, getCardStyle, getLikeOpacity, getNopeOpacity, getNextCardScale, forceSwipe } =
    useSwipeAnimation({ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight });

  const handleReset = useCallback(() => {
    setUsers(MOCK_USERS);
    setLikeCount(0);
  }, []);

  const numActiveFilters = activeFilterCount(filters);

  const renderCards = () => {
    if (users.length === 0) {
      return (
        <EmptyState
          variant="swipes"
          onAction={handleReset}
          onSecondaryAction={() => setShowFilter(true)}
        />
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
              styles.card,
              styles.cardBehind,
              isSecond
                ? { transform: [{ scale: getNextCardScale() }] }
                : { transform: [{ scale: 0.9 }] },
            ]}
          >
            <SwipeCard user={user} isTop={false} style={StyleSheet.absoluteFill} />
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Reward Toast */}
      {rewardToast && (
        <RewardToast
          visible
          type={rewardToast.type}
          streakCount={rewardToast.streakCount}
          onHide={() => setRewardToast(null)}
        />
      )}

      {/* Card stack + header overlay */}
      <View style={styles.cardsArea}>
        {renderCards()}

        {/* Floating header — rendered above cards */}
        <View style={styles.overlay} pointerEvents="box-none">
          <View
            style={[styles.topBar, { paddingTop: STATUS_BAR_HEIGHT + 8 }]}
            pointerEvents="auto"
          >
            {/* Left: undo */}
            <TouchableOpacity style={styles.glassBtn} onPress={() => {}}>
              <Ionicons name="arrow-undo" size={18} color={Colors.white} />
            </TouchableOpacity>

            {/* Center: gradient logo + inline chips */}
            <View style={styles.topCenter}>
              <LinearGradient
                colors={['#FF6B35', '#FF3366']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoCircle}
              >
                <Text style={styles.logoLetter}>S</Text>
              </LinearGradient>

              {(streak >= 2 || likeCount > 0) && (
                <View style={styles.topChips}>
                  {streak >= 2 && (
                    <View style={styles.streakChip}>
                      <Text style={styles.chipText}>🔥 {streak}</Text>
                    </View>
                  )}
                  {likeCount > 0 && (
                    <View style={styles.likeChip}>
                      <Ionicons name="heart" size={10} color={Colors.white} />
                      <Text style={styles.chipText}>{likeCount}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Right: filter */}
            <TouchableOpacity
              style={[styles.glassBtn, numActiveFilters > 0 && styles.glassBtnActive]}
              onPress={() => setShowFilter(true)}
            >
              <Ionicons name="options-outline" size={18} color={Colors.white} />
              {numActiveFilters > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{numActiveFilters}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Active filter chips row */}
          {numActiveFilters > 0 && (
            <View style={styles.filterChipsRow} pointerEvents="auto">
              {filters.maxDistance < 50 && (
                <View style={styles.chip}>
                  <Ionicons name="location" size={10} color={Colors.primary} />
                  <Text style={styles.filterChipText}>≤{filters.maxDistance}km</Text>
                </View>
              )}
              {filters.city && (
                <View style={styles.chip}>
                  <Ionicons name="business" size={10} color={Colors.primary} />
                  <Text style={styles.filterChipText}>{filters.city}</Text>
                </View>
              )}
              {filters.selectedSports.length > 0 && (
                <View style={styles.chip}>
                  <Ionicons name="football" size={10} color={Colors.primary} />
                  <Text style={styles.filterChipText}>
                    {filters.selectedSports.length} sport{filters.selectedSports.length > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {filters.skillLevel && (
                <View style={styles.chip}>
                  <Ionicons name="trophy" size={10} color={Colors.primary} />
                  <Text style={styles.filterChipText}>{filters.skillLevel}</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setFilters(DEFAULT_FILTERS)}>
                <Text style={styles.clearFiltersText}>Clear</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {toast && <ToastNotification message={toast.message} type={toast.type} />}

        {promo && (
          <PromoNotification
            config={promo}
            onDismiss={() => setPromo(null)}
            onCta={() => navigation.navigate('Premium')}
          />
        )}
      </View>

      {/* Action buttons */}
      {users.length > 0 && (
        <View style={styles.actions}>
          <ActionButton variant="neutral" size="sm" onPress={() => {}}>
            <Ionicons name="arrow-undo" size={18} color={Colors.secondary} />
          </ActionButton>

          <ActionButton
            variant="nope"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('left');
            }}
          >
            <Ionicons name="close" size={32} color={Colors.accent} />
          </ActionButton>

          <ActionButton variant="super" size="sm" onPress={() => {}}>
            <Ionicons name="star" size={18} color={Colors.secondary} />
          </ActionButton>

          <ActionButton
            variant="like"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('right');
            }}
          >
            {/* White heart — gradient is the button background */}
            <Ionicons name="heart" size={30} color={Colors.white} />
          </ActionButton>

          <ActionButton variant="neutral" size="sm" onPress={() => navigation.navigate('Premium')}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.primary} />
          </ActionButton>
        </View>
      )}

      {/* Modals */}
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

      <FilterModal
        visible={showFilter}
        current={filters}
        onApply={(f) => setFilters(f)}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // ── Card stack ────────────────────────────────────────────────────────────
  cardsArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Top card: slight horizontal margins + rounded corners
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - Spacing.base,   // 8px margin each side
    height: SCREEN_HEIGHT * 0.76,
    borderRadius: BorderRadius['2xl'],    // 24px — premium rounded
    overflow: 'hidden',
  },

  // Cards behind: narrower to show depth / stacking effect
  cardBehind: {
    borderRadius: BorderRadius['2xl'],
    width: SCREEN_WIDTH - Spacing['2xl'], // 16px margin each side
    overflow: 'hidden',
  },

  // ── Floating header overlay ───────────────────────────────────────────────
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  topCenter: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  logoLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  topChips: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  likeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,51,102,0.75)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  streakChip: {
    backgroundColor: 'rgba(255,107,53,0.85)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  chipText: { color: Colors.white, fontSize: 11, fontWeight: '700' },

  // Glass buttons (undo + filter)
  glassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  glassBtnActive: {
    backgroundColor: 'rgba(255,51,102,0.35)',
    borderColor: 'rgba(255,51,102,0.6)',
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  filterBadgeText: { fontSize: 9, color: Colors.white, fontWeight: '800' },

  // Active filter chips beneath header
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  filterChipText: { fontSize: 11, color: Colors.white, fontWeight: '600' },
  clearFiltersText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    textDecorationLine: 'underline',
  },

  // ── Action bar ────────────────────────────────────────────────────────────
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.xl,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
