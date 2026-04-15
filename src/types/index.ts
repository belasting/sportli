// ─── User & Profile ──────────────────────────────────────────────────────────

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro';

export type Sport = {
  id: string;
  name: string;
  icon: string; // MaterialCommunityIcons name
  emoji: string;
};

export type Availability = {
  days: string[];
  timeSlots: string[];
};

export type User = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  sports: Sport[];
  skillLevel: SkillLevel;
  distance: number; // km
  location: string;
  availability: Availability;
  isVerified?: boolean;
  isPremium?: boolean;
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
};

export type Conversation = {
  id: string;
  matchedUser: User;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
};

// ─── Match ────────────────────────────────────────────────────────────────────

export type Match = {
  id: string;
  user: User;
  matchedAt: Date;
};

// ─── Group Chat ───────────────────────────────────────────────────────────────

export type GroupMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  text: string;
  timestamp: Date;
};

export type GroupChat = {
  id: string;
  name: string;
  sport: Sport;
  members: Pick<User, 'id' | 'name' | 'photos'>[];
  messages: GroupMessage[];
  lastMessage?: GroupMessage;
  unreadCount: number;
  coverPhoto?: string;
};

// ─── Navigation ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  Group: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  ChatConversation: { conversation: Conversation };
  UserProfile: { user: User; fromMatch?: boolean };
  GroupChat: { group: GroupChatType };
  CreateGroup: undefined;
  Premium: undefined;
  Settings: undefined;
  EditProfile: undefined;
};

// ─── Group Chat ───────────────────────────────────────────────────────────────

export type GroupChatType = {
  id: string;
  name: string;
  sport: Sport;
  members: User[];
  memberCount: number;
  messages: Message[];
  lastMessage?: Message;
  coverEmoji: string;
  description: string;
  unreadCount: number;
};

// ─── Filters ──────────────────────────────────────────────────────────────────

export type FilterState = {
  maxDistance: number;
  selectedSports: string[];
  skillLevel: SkillLevel | null;
  city: string | null;
};

// ─── Onboarding ───────────────────────────────────────────────────────────────

export type OnboardingData = {
  selectedSports: string[];
  skillLevel: SkillLevel | null;
  availability: Availability;
  location: string;
  photos: string[];
};
