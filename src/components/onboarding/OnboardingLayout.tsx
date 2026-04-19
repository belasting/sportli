import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from './GradientButton';

interface Props {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  onContinue: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  continueLoading?: boolean;
  children: React.ReactNode;
  scrollable?: boolean;
}

export const OnboardingLayout: React.FC<Props> = ({
  title,
  subtitle,
  step,
  totalSteps = 10,
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  continueLoading = false,
  children,
  scrollable = false,
}) => {
  const progress = (step / totalSteps) * 100;

  return (
    <LinearGradient colors={['#1A0528', '#0D0D1A', '#08080F']} style={styles.bg}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Progress bar */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#FF6B35', '#FF3CAC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` as any }]}
            />
          </View>
        </View>

        {/* Header */}
        <View style={styles.header}>
          {onBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.75)" />
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}
          <Text style={styles.stepText}>{step}/{totalSteps}</Text>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollable}
          >
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {children}
          </ScrollView>

          <SafeAreaView edges={['bottom']} style={styles.footer}>
            <GradientButton
              label={continueLabel}
              onPress={onContinue}
              disabled={continueDisabled}
              loading={continueLoading}
              style={styles.ctaBtn}
            />
          </SafeAreaView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  progressWrap: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, borderRadius: 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexGrow: 1,
  },
  titleWrap: { marginTop: 20, marginBottom: 28 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
  },
  ctaBtn: { width: '100%' },
});
