import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MOCK_USERS, CURRENT_USER } from '../data/mockUsers';
import { RootStackParamList } from '../types';
import { SwipeCard } from '../components/SwipeCard';
import { ActionButton } from '../components/ActionButton';
import { MatchModal } from '../components/MatchModal';
import { FilterModal, FilterState } from '../components/FilterModal';
import { useSwipeAnimation } from '../hooks/useSwipeAnimation';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';
import { User } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  });
  const noMoreAnim = useRef(new Animated.Value(0)).current;

  const triggerMatch = (user: User) => {
    // ~40% chance of match for demo
    if (Math.random() > 0.6) {
      setMatchedUser(user);
      setTimeout(() => setShowMatch(true), 300);
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

  const { position, panResponder, getCardStyle, getLikeOpacity, getNopeOpacity, getNextCardScale, forceSwipe } =
    useSwipeAnimation({
      onSwipeLeft: handleSwipeLeft,
      onSwipeRight: handleSwipeRight,
    });

  const handleReset = () => {
    setUsers(MOCK_USERS);
    setLikeCount(0);
  };

  const renderCards = () => {
    if (users.length === 0) {
      return (
        <Animated.View style={[styles.emptyState, { opacity: noMoreAnim }]}>
          <MaterialCommunityIcons name="emoticon-sad-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptySubtitle}>Come back later or expand your sports filters</Text>
          <View style={styles.emptyAction}>
            <ActionButton onPress={handleReset} variant="neutral">
              <Ionicons name="refresh" size={24} color={Colors.primary} />
            </ActionButton>
          </View>
        </Animated.View>
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
              !isSecond && { transform: [{ scale: 0.88 }] },
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
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.logoMini}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={Colors.white} />
          </LinearGradient>
          <Text style={styles.headerTitle}>Sportli</Text>
        </View>

        <View style={styles.headerRight}>
          <View style={styles.likeCounter}>
            <Ionicons name="heart" size={14} color={Colors.accent} />
            <Text style={styles.likeCountText}>{likeCount}</Text>
          </View>
          <ActionButton variant="neutral" size="sm" onPress={() => setShowFilter(true)}>
            <View style={{ position: 'relative' }}>
              <Ionicons name="options-outline" size={20} color={Colors.textPrimary} />
              {(activeFilters.selectedSports.length > 0 || activeFilters.skillLevel || activeFilters.maxDistance !== 25) && (
                <View style={styles.filterDot} />
              )}
            </View>
          </ActionButton>
        </View>
      </View>

      {/* Cards stack */}
      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>

      {/* Action buttons */}
      {users.length > 0 && (
        <View style={styles.actions}>
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
            <Ionicons name="close" size={34} color={Colors.accent} />
          </ActionButton>

          {/* Super Like */}
          <ActionButton variant="super" size="sm" onPress={() => {}}>
            <Ionicons name="star" size={20} color={Colors.secondary} />
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
            <Ionicons name="heart" size={32} color={Colors.primary} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 58 : 44,
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing.base,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoMini: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  likeCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  likeCountText: {
    ...Typography.label,
    color: Colors.accent,
    fontWeight: '700',
  },
  cardsContainer: {
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
  emptyState: {
    alignItems: 'center',
    gap: Spacing.base,
    paddingHorizontal: Spacing['2xl'],
  },
  emptyTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyAction: {
    marginTop: Spacing.md,
  },
  filterDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});
