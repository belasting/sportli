# Sportli 🏀⚽🎾

> Tinder-style sports buddy matching app — find your perfect workout partner.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Expo ~51 (bare workflow) |
| Language | TypeScript (strict) |
| Navigation | React Navigation v6 |
| Animations | Animated API + react-native-reanimated |
| Icons | @expo/vector-icons (Ionicons + MaterialCommunityIcons) |
| Gradients | expo-linear-gradient |
| Haptics | expo-haptics |

## Project Structure

```
sportli/
├── App.tsx                    # Root entry — gesture + safe area providers
├── src/
│   ├── components/
│   │   ├── ActionButton.tsx   # Circular action buttons (like/nope/super)
│   │   ├── AnimatedButton.tsx # Full-width CTA with press animation
│   │   ├── MatchModal.tsx     # "It's a match!" fullscreen modal
│   │   ├── MessageBubble.tsx  # Chat message bubble
│   │   ├── SportBadge.tsx     # Sport pill/badge
│   │   └── SwipeCard.tsx      # Tinder swipe card with gesture
│   ├── screens/
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── OnboardingScreen.tsx  # 5-step interactive onboarding
│   │   ├── HomeScreen.tsx        # Swipe deck
│   │   ├── ChatListScreen.tsx
│   │   ├── ChatConversationScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── PremiumScreen.tsx     # Monetization UI
│   ├── navigation/
│   │   ├── AppNavigator.tsx   # Root stack
│   │   ├── AuthNavigator.tsx  # Auth flow stack
│   │   └── TabNavigator.tsx   # Bottom tab navigator
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── data/
│   │   ├── mockUsers.ts       # 8 realistic mock profiles
│   │   ├── mockChats.ts       # 5 mock conversations
│   │   └── sports.ts          # 16 sports with icons + emoji
│   ├── hooks/
│   │   ├── useSwipeAnimation.ts  # PanResponder swipe logic
│   │   └── useAnimatedPress.ts   # Scale press animation
│   └── types/
│       └── index.ts
```

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS / Android)

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start

# Then scan the QR code with Expo Go
# Or press 'i' for iOS simulator / 'a' for Android emulator
```

### TypeScript Check

```bash
npm run ts:check
```

## Screens

| Screen | Description |
|---|---|
| Welcome | Landing page with floating sport icons |
| Register | Sign up with password strength meter |
| Login | Sign in with social options |
| Onboarding | 5-step: sports → skill → availability → location → photos |
| Home (Swipe) | Tinder-style card deck with PanResponder gestures |
| Match Modal | Animated "It's a match!" modal |
| Chat List | Conversations with unread badges + match carousel |
| Chat Conversation | Real-time-style chat UI with emoji suggestions |
| Profile | Full profile editor with settings |
| Premium | Paywall with plan selector and feature list |

## Future Supabase Integration

The app is structured for easy backend wiring:

- `src/data/mockUsers.ts` → replace with `supabase.from('users').select()`
- `src/data/mockChats.ts` → replace with `supabase.from('messages').select()` + realtime subscription
- Auth flow (`LoginScreen`, `RegisterScreen`) → wire to `supabase.auth.signIn/signUp()`
- `AppNavigator.tsx` → replace `useState(false)` auth check with `supabase.auth.getSession()`

## GitHub Setup

```bash
# Initialize git
git init
git add .
git commit -m "feat: initial Sportli UI scaffold"
git branch -M main

# Create repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/sportli.git
git push -u origin main
```

## License

MIT — build something great.
