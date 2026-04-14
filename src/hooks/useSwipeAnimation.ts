import { useRef } from 'react';
import { Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;
const SWIPE_OUT_DURATION = 280;

type SwipeDirection = 'left' | 'right';

interface UseSwipeAnimationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const useSwipeAnimation = ({ onSwipeLeft, onSwipeRight }: UseSwipeAnimationProps) => {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
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
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = (direction: SwipeDirection) => {
    position.setValue({ x: 0, y: 0 });
    direction === 'right' ? onSwipeRight() : onSwipeLeft();
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-25deg', '0deg', '25deg'],
    });
    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const getLikeOpacity = () =>
    position.x.interpolate({
      inputRange: [0, SCREEN_WIDTH * 0.25],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

  const getNopeOpacity = () =>
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.25, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

  const getNextCardScale = () =>
    position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 0.5, 0, SCREEN_WIDTH * 0.5],
      outputRange: [1, 0.93, 1],
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
