export const Colors = {
  // Brand — orange-to-pink gradient system (matches reference design)
  primary: '#FF3366',
  primaryDark: '#CC1144',
  primaryLight: 'rgba(255,51,102,0.15)',
  secondary: '#FF6B35',
  secondaryLight: 'rgba(255,107,53,0.15)',
  accent: '#EF4444',
  accentLight: 'rgba(239,68,68,0.12)',

  // Backgrounds — deep dark purple-black
  white: '#FFFFFF',
  background: '#0E0B1E',
  surface: '#1A1728',
  surfaceAlt: '#231E36',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.35)',
  textInverse: '#0E0B1E',

  // Borders
  border: 'rgba(255,255,255,0.09)',
  borderFocus: '#FF3366',

  // Status
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#EF4444',

  // Gradients
  gradientPrimary: ['#FF6B35', '#FF3366'] as const,
  gradientFire: ['#FF6B35', '#FF3366'] as const,
  gradientCard: ['transparent', 'rgba(0,0,0,0.9)'] as const,

  // Swipe overlays
  likeOverlay: 'rgba(255,51,102,0.82)',
  nopeOverlay: 'rgba(239,68,68,0.82)',

  // Shadows
  shadow: 'rgba(0,0,0,0.28)',
  shadowDark: 'rgba(0,0,0,0.52)',
} as const;

export type ColorKey = keyof typeof Colors;
