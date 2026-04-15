import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { AnimatedButton } from '../components/AnimatedButton';
import { Colors, Typography, Spacing, BorderRadius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('Onboarding');
    }, 1200);
  };

  const passwordStrength = (() => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: Colors.accent, width: '30%' };
    if (password.length < 10) return { label: 'Fair', color: Colors.secondary, width: '60%' };
    return { label: 'Strong', color: Colors.success, width: '100%' };
  })();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            style={styles.logoSmall}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={24} color={Colors.white} />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join 50,000+ athletes finding sports buddies</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {[
              { value: '50K+', label: 'Athletes' },
              { value: '12', label: 'Sports' },
              { value: '4.9★', label: 'Rating' },
            ].map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <FocusableInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Alex Rivera"
              icon="person-outline"
              autoCapitalize="words"
            />
            <FocusableInput
              label="Age"
              value={age}
              onChangeText={(v) => {
                const n = v.replace(/[^0-9]/g, '');
                if (n === '' || (parseInt(n) >= 13 && parseInt(n) <= 100)) setAge(n);
                else if (n.length <= 2) setAge(n);
              }}
              placeholder="25"
              icon="calendar-outline"
              keyboardType="number-pad"
            />
            <FocusableInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              icon="mail-outline"
              keyboardType="email-address"
            />
            <View style={styles.passwordWrapper}>
              <FocusableInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                icon="lock-closed-outline"
                secureTextEntry={!showPassword}
                rightElement={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={Colors.textMuted}
                    />
                  </TouchableOpacity>
                }
              />
              {passwordStrength && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        { width: passwordStrength.width as any, backgroundColor: passwordStrength.color },
                      ]}
                    />
                  </View>
                  <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                    {passwordStrength.label}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <AnimatedButton
            label="Create Account"
            onPress={handleRegister}
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<Ionicons name="rocket-outline" size={20} color={Colors.white} />}
          />

          <Text style={styles.terms}>
            By creating an account you agree to our{' '}
            <Text style={styles.termsLink}>Terms</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Already have an account?{' '}
              <Text style={styles.loginLinkBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const FocusableInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  icon: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
  rightElement?: React.ReactNode;
}> = ({ label, value, onChangeText, placeholder, icon, secureTextEntry, keyboardType, autoCapitalize, rightElement }) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrapper}>
      <Text style={fi.label}>{label}</Text>
      <View style={[fi.field, focused && fi.fieldFocused]}>
        <Ionicons name={icon as any} size={18} color={focused ? Colors.primary : Colors.textMuted} />
        <TextInput
          style={fi.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {rightElement}
      </View>
    </View>
  );
};

const fi = StyleSheet.create({
  wrapper: { gap: Spacing.xs },
  label: { ...Typography.label, color: Colors.textSecondary },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fieldFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  input: {
    flex: 1,
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing['2xl'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing['3xl'],
    marginBottom: Spacing['2xl'],
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSmall: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: Spacing['2xl'], paddingBottom: Spacing['3xl'] },
  titleSection: { gap: Spacing.sm },
  title: { ...Typography.h1, color: Colors.textPrimary },
  subtitle: { ...Typography.bodyLarge, color: Colors.textSecondary },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { ...Typography.h3, color: Colors.primaryDark },
  statLabel: { ...Typography.caption, color: Colors.textSecondary },
  form: { gap: Spacing.lg },
  passwordWrapper: { gap: Spacing.sm },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  strengthLabel: { ...Typography.caption, fontWeight: '600', minWidth: 45 },
  terms: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  termsLink: { color: Colors.primary, textDecorationLine: 'underline' },
  loginLink: { alignSelf: 'center' },
  loginLinkText: { ...Typography.body, color: Colors.textSecondary },
  loginLinkBold: { color: Colors.primary, fontWeight: '700' },
});
