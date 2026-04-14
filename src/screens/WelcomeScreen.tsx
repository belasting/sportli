import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { AnimatedButton } from '../components/AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FLOATING_SPORTS = ['basketball', 'soccer', 'tennis', 'run', 'swim', 'bike', 'volleyball'];

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.7)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 50, useNativeDriver: true }),
      Animated.spring(logoScaleAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -12, duration: 2200, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#1a1a2e', '#0f3460', '#1a237e']}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating sport icons */}
      <View style={styles.iconsContainer} pointerEvents="none">
        {FLOATING_SPORTS.map((icon, i) => (
          <Animated.View
            key={icon}
            style={[
              styles.floatingIcon,
              {
                top: `${12 + (i % 4) * 22}%`,
                left: i % 2 === 0 ? `${5 + i * 8}%` : undefined,
                right: i % 2 !== 0 ? `${5 + i * 6}%` : undefined,
                opacity: 0.08 + (i % 3) * 0.04,
                transform: [{ translateY: floatAnim }],
              },
            ]}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={44 + (i % 3) * 16}
              color={Colors.white}
            />
          </Animated.View>
        ))}
      </View>

      {/* Main content */}
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Logo */}
        <Animated.View
          style={[styles.logoContainer, { transform: [{ scale: logoScaleAnim }] }]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.logoCircle}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={44} color={Colors.white} />
          </LinearGradient>
        </Animated.View>

        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.appName}>Sportli</Text>
          <View style={styles.taglineRow}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>Find your sports buddy</Text>
            <View style={styles.taglineLine} />
          </View>
        </View>

        {/* Feature pills */}
        <View style={styles.features}>
          {[
            { icon: 'heart', label: 'Swipe & Match' },
            { icon: 'chatbubble-ellipses', label: 'Chat & Plan' },
            { icon: 'trophy', label: 'Play Together' },
          ].map((f) => (
            <View key={f.label} style={styles.featurePill}>
              <Ionicons name={f.icon as any} size={14} color={Colors.primary} />
              <Text style={styles.featureText}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <AnimatedButton
            label="Get Started"
            onPress={() => navigation.navigate('Register')}
            variant="primary"
            size="lg"
            fullWidth
          />
          <AnimatedButton
            label="I already have an account"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            size="md"
            fullWidth
            textStyle={{ color: 'rgba(255,255,255,0.75)' }}
          />
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' & '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconsContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingIcon: {
    position: 'absolute',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
    gap: Spacing['2xl'],
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    shadowOpacity: 0.6,
    elevation: 16,
  },
  brandContainer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  appName: {
    fontSize: 56,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  tagline: {
    ...Typography.label,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  taglineLine: {
    height: 1,
    width: 32,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  featureText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  buttons: {
    gap: Spacing.md,
  },
  terms: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.38)',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'underline',
  },
});
