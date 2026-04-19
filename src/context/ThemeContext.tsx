import React, { createContext, useContext, useState, useMemo } from 'react';

// ─── Dark Palette (default — matches design system) ──────────────────────────

const darkColors = {
  primary: '#FF3366',
  primaryDark: '#CC1144',
  primaryLight: 'rgba(255,51,102,0.15)',
  secondary: '#FF6B35',
  secondaryLight: 'rgba(255,107,53,0.15)',
  accent: '#EF4444',
  accentLight: 'rgba(239,68,68,0.12)',

  white: '#FFFFFF',
  background: '#0E0B1E',
  surface: '#1A1728',
  surfaceAlt: '#231E36',

  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.35)',
  textInverse: '#0E0B1E',

  border: 'rgba(255,255,255,0.09)',
  borderFocus: '#FF3366',

  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF4444',

  gradientPrimary: ['#FF6B35', '#FF3366'] as [string, string],
  gradientFire: ['#FF6B35', '#FF3366'] as [string, string],
  gradientCard: ['transparent', 'rgba(0,0,0,0.9)'] as [string, string],

  likeOverlay: 'rgba(255,51,102,0.82)',
  nopeOverlay: 'rgba(239,68,68,0.82)',

  shadow: 'rgba(0,0,0,0.28)',
  shadowDark: 'rgba(0,0,0,0.52)',

  cardBg: '#0E0B1E',
};

// ─── Light Palette (legacy) ───────────────────────────────────────────────────

const lightColors = {
  ...darkColors,
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F4F8',
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  border: '#E5E7EB',
  cardBg: '#1a1a2e',
  shadow: 'rgba(0,0,0,0.08)',
  shadowDark: 'rgba(0,0,0,0.18)',
};

export type AppColors = typeof darkColors;

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  isDark: boolean;
  toggleTheme: () => void;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: true,
  toggleTheme: () => {},
  colors: darkColors,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Always dark — matches design system

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
