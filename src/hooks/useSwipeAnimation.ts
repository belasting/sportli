import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 320;

type SwipeDirection = 'left' | 'right';

interface UseSwipeAnimationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const useSwipeAnimation = ({ onSwipeLeft, onSwipeRight }: UseSwipeAnimationProps) => {
  const position = useRef(new Animated.ValueXY()).current;

  // Use refs for callbacks to avoid stale closures — panResponder is only
  // created once via useRef, so it must call callbacks through live refs.
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);
  onSwipeLeftRef.current = onSwipeLeft;
  onSwipeRightRef.current = onSwipeRight;

  // forceSwipe and resetPosition need to be accessible inside panResponder
  // which is also created once. We use refs so the latest version is always called.
  const forceSwipeRef = useRef<(direction: SwipeDirection) => void>(() => {});
  const resetPositionRef = useRef<() => void>(() => {});

  const panResponder = useRef(
    PanResponder.create({
      // Do NOT claim on start — this lets TouchableOpacity handle taps.
      // Only claim when there's clear horizontal movement (swipe).
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        // Claim if horizontal movement exceeds 6px (clearly a swipe, not tap)
        return Math.abs(gesture.dx) > 6 && Math.abs(gesture.dx) > Math.abs(gesture.dy);
      },
      onPanResponderGrant: () => {
        // Flatten accumulated offset before each drag
        position.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        position.flattenOffset();
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipeRef.current('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipeRef.current('left');
        } else {
          resetPositionRef.current();
        }
      },
      onPanResponderTerminate: () => {
        position.flattenOffset();
        resetPositionRef.current();
      },
    })
  ).current;

  const forceSwipe = (direction: SwipeDirection) => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.6 : -SCREEN_WIDTH * 1.6;
    Animated.spring(position, {
      toValue: { x, y: direction === 'right' ? -40 : 40 },
      useNativeDriver: false,
      friction: 6,
      tension: 50,
      overshootClamping: true,
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = (direction: SwipeDirection) => {
    position.setValue({ x: 0, y: 0 });
    direction === 'right' ? onSwipeRightRef.current() : onSwipeLeftRef.current();
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 7,
      tension: 70,
    }).start();
  };

  // Keep refs pointing to latest function versions
  forceSwipeRef.current = forceSwipe;
  resetPositionRef.current = resetPosition;

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-18deg', '0deg', '18deg'],
      extrapolate: 'clamp',
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const getLikeOpacity = () =>
    position.x.interpolate({
      inputRange: [0, SCREEN_WIDTH * 0.2],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const getNopeOpacity = () =>
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.2, 0],
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
