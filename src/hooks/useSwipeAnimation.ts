import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 250;

// A "tap" is a touch that moves < 8px in any direction and completes in < 350ms
const TAP_MAX_DISTANCE = 8;
const TAP_MAX_DURATION = 350;

type SwipeDirection = 'left' | 'right';

interface UseSwipeAnimationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  /** Called when the user taps the card (not a swipe). pageX = absolute screen X */
  onTap?: (pageX: number) => void;
}

export const useSwipeAnimation = ({
  onSwipeLeft,
  onSwipeRight,
  onTap,
}: UseSwipeAnimationProps) => {
  const position = useRef(new Animated.ValueXY()).current;
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);

  // forceSwipe is referenced inside panResponder — define it before the ref
  const forceSwipeRef = useRef<(dir: SwipeDirection) => void>(null as any);

  const panResponder = useRef(
    PanResponder.create({
      // Always claim the gesture — this is the key fix.
      // Deep children (info button TouchableOpacity) will still win because
      // React Native asks children first (bubble-up) before the parent.
      // The old tapLeft/tapRight TouchableOpacity areas have been removed so
      // there's nothing stealing the touch anymore.
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,

      onPanResponderGrant: (e) => {
        touchStartX.current = e.nativeEvent.pageX;
        touchStartTime.current = Date.now();
        // Merge any existing offset so the card doesn't jump on re-grab
        position.flattenOffset();
        position.extractOffset();
      },

      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },

      onPanResponderRelease: (_, { dx, dy }) => {
        position.flattenOffset();

        const elapsed = Date.now() - touchStartTime.current;
        const isTap =
          Math.abs(dx) < TAP_MAX_DISTANCE &&
          Math.abs(dy) < TAP_MAX_DISTANCE &&
          elapsed < TAP_MAX_DURATION;

        if (isTap) {
          // Reset card position (it may have moved slightly) then fire tap
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
            friction: 8,
            tension: 100,
          }).start();
          onTap?.(touchStartX.current);
          return;
        }

        if (dx > SWIPE_THRESHOLD) {
          forceSwipeRef.current('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          forceSwipeRef.current('left');
        } else {
          resetPosition();
        }
      },

      onPanResponderTerminate: () => {
        // Gesture was stolen (e.g. system gesture) — spring back
        position.flattenOffset();
        resetPosition();
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 6,
      tension: 80,
    }).start();
  };

  const forceSwipe = (direction: SwipeDirection) => {
    // Flatten offset so animation starts from the right place
    position.flattenOffset();
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      direction === 'right' ? onSwipeRight() : onSwipeLeft();
    });
  };

  // Keep the ref in sync so the panResponder closure can call forceSwipe
  forceSwipeRef.current = forceSwipe;

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-22deg', '0deg', '22deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const getLikeOpacity = () =>
    position.x.interpolate({
      inputRange: [0, SCREEN_WIDTH * 0.22],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const getNopeOpacity = () =>
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.22, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

  const getNextCardScale = () =>
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
      outputRange: [1, 0.94, 1],
      extrapolate: 'clamp',
    });

  return {
    position,
    panResponder,
    getCardStyle,
    getLikeOpacity,
    getNopeOpacity,
    getNextCardScale,
    forceSwipe,
  };
};
