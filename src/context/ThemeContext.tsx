import React, { createContext, useContext, useState, useMemo } from 'react';

// ─── Light Palette ────────────────────────────────────────────────────────────

const lightColors = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  primaryLight: '#E1F5FE',
  secondary: '#FF9800',
  secondaryLight: '#FFF3E0',
  accent: '#FF5252',
  accentLight: '#FFEBEE',

  white: '#FFFFFF',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F4F8',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  borderFocus: '#4FC3F7',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  gradientPrimary: ['#4FC3F7', '#0288D1'] as [string, string],
  gradientFire: ['#FF9800', '#FF5252'] as [string, string],
  gradientCard: ['transparent', 'rgba(0,0,0,0.85)'] as [string, string],

  likeOverlay: 'rgba(79, 195, 247, 0.85)',
  nopeOverlay: 'rgba(255, 82, 82, 0.85)',

  shadow: 'rgba(0,0,0,0.08)',
  shadowDark: 'rgba(0,0,0,0.18)',

  // Card stack bg
  cardBg: '#1a1a2e',
};

// ─── Dark Palette ─────────────────────────────────────────────────────────────

const darkColors = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  primaryLight: '#0D2535',
  secondary: '#FF9800',
  secondaryLight: '#1A0F00',
  accent: '#FF5252',
  accentLight: '#1A0808',

  white: '#1E1E2E',
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceAlt: '#16213E',

  textPrimary: '#F0F0FF',
  textSecondary: '#A0AEC0',
  textMuted: '#718096',
  textInverse: '#0F0F1A',

  border: '#2D3748',
  borderFocus: '#4FC3F7',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  gradientPrimary: ['#4FC3F7', '#0288D1'] as [string, string],
  gradientFire: ['#FF9800', '#FF5252'] as [string, string],
  gradientCard: ['transparent', 'rgba(0,0,0,0.92)'] as [string, string],

  likeOverlay: 'rgba(79, 195, 247, 0.85)',
  nopeOverlay: 'rgba(255, 82, 82, 0.85)',

  shadow: 'rgba(0,0,0,0.35)',
  shadowDark: 'rgba(0,0,0,0.55)',

  cardBg: '#0D0D1A',
};

export type AppColors = typeof lightColors;

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggleTheme: () => {},
  colors: lightColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((d) => !d),
      colors: isDark ? darkColors : lightColors,
    }),
    [isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
