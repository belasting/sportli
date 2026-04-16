// iOS-style dark mode colour palette
// Mirrors the same keys as colors.ts so the two are interchangeable.
export const DarkColors = {
  primary: '#4FC3F7',
  primaryDark: '#0288D1',
  primaryLight: '#0D2535',
  secondary: '#FF9800',
  secondaryLight: '#1E1200',
  accent: '#FF5252',
  accentLight: '#200A0A',

  // Surfaces — iOS-style layered dark backgrounds
  white: '#FFFFFF',
  background: '#000000',
  surface: '#1C1C1E',
  surfaceAlt: '#2C2C2E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#EBEBF5CC',
  textMuted: '#8E8E93',
  textInverse: '#000000',

  // Borders & separators
  border: '#38383A',
  borderFocus: '#4FC3F7',

  // Status
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',

  // Gradient arrays (same as light — gradients look fine on dark too)
  gradientPrimary: ['#4FC3F7', '#0288D1'] as const,
  gradientFire: ['#FF9800', '#FF5252'] as const,
  gradientCard: ['transparent', 'rgba(0,0,0,0.85)'] as const,

  likeOverlay: 'rgba(79, 195, 247, 0.85)',
  nopeOverlay: 'rgba(255, 82, 82, 0.85)',

  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowDark: 'rgba(0, 0, 0, 0.7)',
} as const;
