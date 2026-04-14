export const Colors = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  primaryLight: '#E1F5FE',
  secondary: '#FF9800',
  secondaryLight: '#FFF3E0',
  accent: '#FF5252',
  accentLight: '#FFEBEE',

  // Neutrals
  white: '#FFFFFF',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F4F8',

  // Text
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Borders
  border: '#E5E7EB',
  borderFocus: '#4FC3F7',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Gradients (used as arrays)
  gradientPrimary: ['#4FC3F7', '#0288D1'] as const,
  gradientFire: ['#FF9800', '#FF5252'] as const,
  gradientCard: ['transparent', 'rgba(0,0,0,0.85)'] as const,

  // Swipe overlays
  likeOverlay: 'rgba(79, 195, 247, 0.85)',
  nopeOverlay: 'rgba(255, 82, 82, 0.85)',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.08)',
  shadowDark: 'rgba(0, 0, 0, 0.18)',
} as const;

export type ColorKey = keyof typeof Colors;
