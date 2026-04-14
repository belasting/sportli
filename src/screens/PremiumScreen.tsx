import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AnimatedButton } from '../components/AnimatedButton';
import { useAnimatedPress } from '../hooks/useAnimatedPress';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

type PlanId = 'weekly' | 'monthly' | 'yearly';

interface Plan {
  id: PlanId;
  label: string;
  price: string;
  pricePerMonth: string;
  badge?: string;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'weekly',
    label: '1 Week',
    price: '$4.99',
    pricePerMonth: '$4.99/wk',
    color: Colors.primary,
  },
  {
    id: 'monthly',
    label: '1 Month',
    price: '$12.99',
    pricePerMonth: '$12.99/mo',
    badge: 'Popular',
    color: Colors.secondary,
  },
  {
    id: 'yearly',
    label: '1 Year',
    price: '$59.99',
    pricePerMonth: '$5.00/mo',
    badge: 'Best Value',
    color: Colors.success,
  },
];

const FEATURES = [
  {
    icon: 'infinite-outline' as const,
    title: 'Unlimited Swipes',
    subtitle: 'Never run out of potential matches',
    gradient: [Colors.primary, Colors.primaryDark] as const,
  },
  {
    icon: 'heart-circle' as const,
    title: 'See Who Liked You',
    subtitle: 'Know who\'s already into you before swiping',
    gradient: [Colors.accent, '#C62828'] as const,
  },
  {
    icon: 'flash' as const,
    title: 'Profile Boost',
    subtitle: 'Get 10x more visibility for 30 minutes',
    gradient: [Colors.secondary, '#E65100'] as const,
  },
  {
    icon: 'star' as const,
    title: 'Super Likes',
    subtitle: '5 Super Likes per day to stand out',
    gradient: ['#9C27B0', '#6A1B9A'] as const,
  },
  {
    icon: 'refresh-circle' as const,
    title: 'Rewind',
    subtitle: 'Undo your last swipe anytime',
    gradient: ['#00BCD4', '#0097A7'] as const,
  },
  {
    icon: 'location' as const,
    title: 'Passport Mode',
    subtitle: 'Change your location to match anywhere',
    gradient: ['#4CAF50', '#388E3C'] as const,
  },
];

const PlanCard: React.FC<{ plan: Plan; selected: boolean; onSelect: () => void }> = ({
  plan,
  selected,
  onSelect,
}) => {
  const { scaleAnim, onPressIn, onPressOut } = useAnimatedPress(0.96);

  return (
    <TouchableOpacity onPress={onSelect} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
      <Animated.View
        style={[
          pc.card,
          selected && { borderColor: plan.color, borderWidth: 2.5 },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {plan.badge && (
          <View style={[pc.badge, { backgroundColor: plan.color }]}>
            <Text style={pc.badgeText}>{plan.badge}</Text>
          </View>
        )}
        <Text style={pc.period}>{plan.label}</Text>
        <Text style={[pc.price, selected && { color: plan.color }]}>{plan.price}</Text>
        <Text style={pc.perMonth}>{plan.pricePerMonth}</Text>
        {selected && (
          <View style={[pc.checkIcon, { backgroundColor: plan.color }]}>
            <Ionicons name="checkmark" size={14} color={Colors.white} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const pc = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -10,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  badgeText: { ...Typography.caption, color: Colors.white, fontWeight: '700' },
  period: { ...Typography.bodySmall, color: Colors.textSecondary, marginTop: Spacing.sm },
  price: { ...Typography.h3, color: Colors.textPrimary, fontWeight: '800' },
  perMonth: { ...Typography.caption, color: Colors.textMuted },
  checkIcon: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

export const PremiumScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('monthly');

  const currentPlan = PLANS.find((p) => p.id === selectedPlan)!;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={['#FF9800', '#FF5722', '#E91E63']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {/* Close button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={22} color={Colors.white} />
          </TouchableOpacity>

          {/* Crown */}
          <View style={styles.crownContainer}>
            <MaterialCommunityIcons name="crown" size={56} color="#FFD700" />
          </View>

          <Text style={styles.heroTitle}>Sportli+</Text>
          <Text style={styles.heroSubtitle}>
            Get more matches, play more sports
          </Text>

          {/* Social proof */}
          <View style={styles.proofRow}>
            <View style={styles.proofItem}>
              <Text style={styles.proofValue}>3x</Text>
              <Text style={styles.proofLabel}>More Matches</Text>
            </View>
            <View style={styles.proofDivider} />
            <View style={styles.proofItem}>
              <Text style={styles.proofValue}>50K+</Text>
              <Text style={styles.proofLabel}>Premium Users</Text>
            </View>
            <View style={styles.proofDivider} />
            <View style={styles.proofItem}>
              <Text style={styles.proofValue}>4.9★</Text>
              <Text style={styles.proofLabel}>App Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          {/* Plan selector */}
          <View style={styles.plansSection}>
            <Text style={styles.plansTitle}>Choose Your Plan</Text>
            <View style={styles.plansRow}>
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                />
              ))}
            </View>
          </View>

          {/* CTA */}
          <AnimatedButton
            label={`Continue with ${currentPlan.label} — ${currentPlan.price}`}
            onPress={() => {}}
            variant="secondary"
            size="lg"
            fullWidth
            icon={<MaterialCommunityIcons name="crown" size={18} color={Colors.white} />}
          />
          <Text style={styles.cancelText}>Cancel anytime. No commitment.</Text>

          {/* Features */}
          <Text style={styles.featuresTitle}>Everything Included</Text>
          <View style={styles.featuresList}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <LinearGradient
                  colors={feature.gradient as any}
                  style={styles.featureIconBg}
                >
                  <Ionicons name={feature.icon} size={20} color={Colors.white} />
                </LinearGradient>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                </View>
                <Ionicons name="checkmark-circle" size={22} color={Colors.success} />
              </View>
            ))}
          </View>

          {/* Trust signals */}
          <View style={styles.trustRow}>
            {[
              { icon: 'shield-checkmark-outline', label: 'Secure Payment' },
              { icon: 'refresh-outline', label: 'Cancel Anytime' },
              { icon: 'star-outline', label: 'Money Back' },
            ].map((t) => (
              <View key={t.label} style={styles.trustItem}>
                <Ionicons name={t.icon as any} size={24} color={Colors.primary} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.legalText}>
            Payment will be charged to your account. Subscription automatically renews unless cancelled.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: Spacing['3xl'],
    paddingHorizontal: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.base,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 44,
    right: Spacing['2xl'],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -1,
  },
  heroSubtitle: {
    ...Typography.bodyLarge,
    color: 'rgba(255,255,255,0.88)',
    textAlign: 'center',
  },
  proofRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginTop: Spacing.sm,
    gap: Spacing.base,
  },
  proofItem: { flex: 1, alignItems: 'center', gap: 3 },
  proofValue: { ...Typography.h3, color: Colors.white, fontWeight: '800' },
  proofLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  proofDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: {
    padding: Spacing['2xl'],
    gap: Spacing.xl,
  },
  plansSection: { gap: Spacing.base },
  plansTitle: { ...Typography.h3, color: Colors.textPrimary },
  plansRow: { flexDirection: 'row', gap: Spacing.md },
  cancelText: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', marginTop: -Spacing.md },
  featuresTitle: { ...Typography.h3, color: Colors.textPrimary },
  featuresList: {
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { flex: 1 },
  featureTitle: { ...Typography.labelLarge, color: Colors.textPrimary },
  featureSubtitle: { ...Typography.bodySmall, color: Colors.textSecondary },
  trustRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadow.sm,
  },
  trustItem: { flex: 1, alignItems: 'center', gap: Spacing.sm },
  trustLabel: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
  legalText: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
