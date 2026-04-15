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
import { useSwipeAnimation } from '../hooks/useSwipeAnimation';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius } from '../theme';
import { User, RootStackParamList, FilterState } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
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
  const { colors, isDark } = useTheme();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [showMatch, setShowMatch] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toast, setToast] = useState<{ message: string; type: 'like' | 'nope' | 'match' } | null>(null);
  const [promo, setPromo] = useState<PromoConfig | null>(null);
  const swipeCountRef = useRef(0);

  // Show a promo every ~4 swipes
  const lastPromoIdRef = useRef<string | null>(null);
  const maybeShowPromo = useCallback(() => {
    swipeCountRef.current += 1;
    if (swipeCountRef.current % 4 === 0 && !promo) {
      const msgs = PROMO_MESSAGES.filter((p) => p.id !== lastPromoIdRef.current);
      const pick = msgs[Math.floor(Math.random() * msgs.length)];
      lastPromoIdRef.current = pick.id;
      setTimeout(() => setPromo(pick), 800);
    }
  }, [promo]);

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
  }, [maybeShowPromo]);

  const handleSwipeLeft = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUsers((prev) => {
      const swiped = prev[prev.length - 1];
      if (swiped) showToast(`Passed`, 'nope');
      return prev.slice(0, -1);
    });
    maybeShowPromo();
  }, [maybeShowPromo]);

  const { panResponder, getCardStyle, getLikeOpacity, getNopeOpacity, getNextCardScale, forceSwipe } =
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
          <MaterialCommunityIcons name="emoticon-happy-outline" size={72} color="rgba(255,255,255,0.4)" />
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptySubtitle}>Come back later or adjust your filters</Text>
          <TouchableOpacity style={styles.emptyResetBtn} onPress={handleReset}>
            <Ionicons name="refresh" size={18} color="#fff" />
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
              styles.card,
              styles.cardWrapper,
              isSecond
                ? { transform: [{ scale: getNextCardScale() }] }
                : { transform: [{ scale: 0.90 }] },
            ]}
          >
            <SwipeCard user={user} isTop={false} style={StyleSheet.absoluteFill} />
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Full-screen card stack ── */}
      <View style={styles.cardsArea}>
        {renderCards()}

        {/* Glass overlay: filter button + active chips */}
        <View style={styles.overlay} pointerEvents="box-none">
          {/* Top-right controls */}
          <View style={[styles.topControls, { paddingTop: STATUS_BAR_HEIGHT }]} pointerEvents="auto">
            <View style={styles.topRight}>
              {likeCount > 0 && (
                <View style={styles.likeChip}>
                  <Ionicons name="heart" size={12} color="#fff" />
                  <Text style={styles.likeChipText}>{likeCount}</Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.glassBtn, numActiveFilters > 0 && styles.glassBtnActive]}
                onPress={() => setShowFilter(true)}
              >
                <Ionicons name="options-outline" size={18} color="#fff" />
                {numActiveFilters > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{numActiveFilters}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Active filter chips row */}
            {numActiveFilters > 0 && (
              <View style={styles.filterChipsRow}>
                {filters.maxDistance < 50 && (
                  <View style={styles.chip}>
                    <Ionicons name="location" size={10} color={colors.primary} />
                    <Text style={styles.chipText}>≤{filters.maxDistance}km</Text>
                  </View>
                )}
                {filters.city && (
                  <View style={styles.chip}>
                    <Ionicons name="business" size={10} color={colors.primary} />
                    <Text style={styles.chipText}>{filters.city}</Text>
                  </View>
                )}
                {filters.selectedSports.length > 0 && (
                  <View style={styles.chip}>
                    <Ionicons name="football" size={10} color={colors.primary} />
                    <Text style={styles.chipText}>
                      {filters.selectedSports.length} sport{filters.selectedSports.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
                {filters.skillLevel && (
                  <View style={styles.chip}>
                    <Ionicons name="trophy" size={10} color={colors.primary} />
                    <Text style={styles.chipText}>{filters.skillLevel}</Text>
                  </View>
                )}
                <TouchableOpacity onPress={() => setFilters(DEFAULT_FILTERS)}>
                  <Text style={styles.clearFiltersText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Toast */}
        {toast && <ToastNotification message={toast.message} type={toast.type} />}

        {/* Promo notification */}
        {promo && (
          <PromoNotification
            config={promo}
            onDismiss={() => setPromo(null)}
            onCta={() => navigation.navigate('Premium')}
          />
        )}
      </View>

      {/* ── Action buttons bar ── */}
      {users.length > 0 && (
        <View style={[styles.actions, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <ActionButton variant="neutral" size="sm" onPress={() => {}}>
            <Ionicons name="arrow-undo" size={18} color={colors.secondary} />
          </ActionButton>

          <ActionButton
            variant="nope"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('left');
            }}
          >
            <Ionicons name="close" size={32} color={colors.accent} />
          </ActionButton>

          <ActionButton variant="super" size="sm" onPress={() => {}}>
            <Ionicons name="star" size={18} color={colors.secondary} />
          </ActionButton>

          <ActionButton
            variant="like"
            size="lg"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              forceSwipe('right');
            }}
          >
            <Ionicons name="heart" size={30} color={colors.primary} />
          </ActionButton>

          <ActionButton variant="neutral" size="sm" onPress={() => navigation.navigate('Premium')}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={colors.primary} />
          </ActionButton>
        </View>
      )}

      {/* ── Modals ── */}
      {matchedUser && (
        <MatchModal
          visible={showMatch}
          currentUser={CURRENT_USER}
          matchedUser={matchedUser}
          onSendMessage={() => { setShowMatch(false); setMatchedUser(null); }}
          onKeepSwiping={() => { setShowMatch(false); setMatchedUser(null); }}
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
  container: { flex: 1 },

  cardsArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: SCREEN_HEIGHT * 0.82,
    borderRadius: 0,
    overflow: 'hidden',
  },

  cardWrapper: {
    borderRadius: 24,
    width: Dimensions.get('window').width - 24,
    overflow: 'hidden',
  },

  // Glass overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  topControls: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.sm,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  likeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,82,82,0.75)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  likeChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  glassBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  glassBtnActive: {
    backgroundColor: 'rgba(79,195,247,0.6)',
    borderColor: 'rgba(79,195,247,0.8)',
  },
  filterBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF5252',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.4)',
  },
  filterBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  chipText: { fontSize: 11, color: '#0288D1', fontWeight: '600' },
  clearFiltersText: { fontSize: 11, color: 'rgba(255,255,255,0.75)', textDecorationLine: 'underline' },

  // Action buttons
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 30 : Spacing.xl,
    borderTopWidth: 1,
  },

  // Empty state
  emptyState: { alignItems: 'center', gap: Spacing.base, paddingHorizontal: Spacing['2xl'] },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
  emptyResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(79,195,247,0.8)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  emptyResetText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
