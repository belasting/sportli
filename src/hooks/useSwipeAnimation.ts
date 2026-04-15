import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 260;

type SwipeDirection = 'left' | 'right';

interface UseSwipeAnimationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const useSwipeAnimation = ({ onSwipeLeft, onSwipeRight }: UseSwipeAnimationProps) => {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      // Return false on start so quick taps pass through to child TouchableOpacitys
      // (fixes the duplicate/stuck photo navigation bug)
      onStartShouldSetPanResponder: () => false,
      // Only capture the gesture once the user actually drags horizontally
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy),
      onPanResponderGrant: () => {
        // Move the current animated value into the offset so there's no jump
        position.extractOffset();
      },
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderRelease: (_, { dx }) => {
        position.flattenOffset();
        if (dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: SwipeDirection) => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction: SwipeDirection) => {
    position.flattenOffset();
    position.setValue({ x: 0, y: 0 });
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 6,
      tension: 80,
    }).start();
  };

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
