import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = [
  '#4FC3F7',
  '#FF9800',
  '#FF5252',
  '#FFD700',
  '#A8E6CF',
  '#FF80AB',
  '#B39DDB',
  '#80CBC4',
  '#FFAB40',
  '#69F0AE',
];

type Shape = 'square' | 'circle' | 'rect';

interface Particle {
  y: Animated.Value;
  x: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  startX: number;
  color: string;
  size: number;
  shape: Shape;
  delay: number;
  duration: number;
  driftX: number;
  rotationRange: string;
}

const PARTICLE_COUNT = 32;

function createParticles(): Particle[] {
  const shapes: Shape[] = ['square', 'circle', 'rect'];
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    y: new Animated.Value(0),
    x: new Animated.Value(0),
    rotate: new Animated.Value(0),
    opacity: new Animated.Value(0),
    startX:
      (SCREEN_WIDTH / PARTICLE_COUNT) * i +
      (((i * 37) % 60) - 30), // deterministic spread
    color: COLORS[i % COLORS.length],
    size: 6 + (i % 5) * 2,
    shape: shapes[i % 3],
    delay: (i % 8) * 90,
    duration: 2400 + (i % 7) * 200,
    driftX: ((i % 7) - 3) * 22,
    rotationRange: `${i % 2 === 0 ? '' : '-'}${300 + (i % 4) * 90}deg`,
  }));
}

interface ConfettiAnimationProps {
  visible: boolean;
}

export const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ visible }) => {
  const particles = useRef<Particle[]>(createParticles()).current;
  const animationsRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!visible) return;

    animationsRef.current?.stop();

    particles.forEach((p) => {
      p.y.setValue(0);
      p.x.setValue(0);
      p.rotate.setValue(0);
      p.opacity.setValue(1);
    });

    const anims = particles.map((p) =>
      Animated.sequence([
        Animated.delay(p.delay),
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: SCREEN_HEIGHT + 80,
            duration: p.duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: p.driftX,
            duration: p.duration,
            useNativeDriver: true,
          }),
          Animated.timing(p.rotate, {
            toValue: 1,
            duration: p.duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(p.opacity, {
              toValue: 1,
              duration: p.duration * 0.65,
              useNativeDriver: true,
            }),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: p.duration * 0.35,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ])
    );

    animationsRef.current = Animated.parallel(anims);
    animationsRef.current.start();

    return () => animationsRef.current?.stop();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const rotateInterp = p.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', p.rotationRange],
        });

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              top: -20,
              left: p.startX,
              width: p.shape === 'rect' ? p.size * 2 : p.size,
              height: p.size,
              borderRadius:
                p.shape === 'circle' ? p.size / 2 : p.shape === 'square' ? 2 : 1,
              backgroundColor: p.color,
              opacity: p.opacity,
              transform: [
                { translateY: p.y },
                { translateX: p.x },
                { rotate: rotateInterp },
              ],
            }}
          />
        );
      })}
    </View>
  );
};
