import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatListScreen } from '../screens/ChatListScreen';
import { GroupChatListScreen } from '../screens/GroupChatListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MainTabParamList } from '../types';
import { Typography } from '../theme';
import { MOCK_CONVERSATIONS } from '../data/mockChats';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator<MainTabParamList>();
const totalUnread = MOCK_CONVERSATIONS.reduce((acc, c) => acc + c.unreadCount, 0);

// iOS-style tab icon with optional unread badge
const TabIcon = ({
  name,
  focused,
  badge,
  activeColor,
  inactiveColor,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  badge?: number;
  activeColor: string;
  inactiveColor: string;
}) => (
  <View style={ti.wrap}>
    <Ionicons
      name={focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap)}
      size={24}
      color={focused ? activeColor : inactiveColor}
    />
    {!!badge && (
      <View style={ti.badge}>
        <Text style={ti.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    )}
  </View>
);

const ti = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '800' },
});

export const TabNavigator: React.FC = () => {
  const { isDark, colors } = useTheme();

  const tabBg = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#38383A' : 'rgba(0,0,0,0.08)';
  const activeColor = colors.primary;
  const inactiveColor = isDark ? '#636366' : '#8E8E93';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor: borderColor,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
          // iOS-style subtle shadow instead of hard border
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: isDark ? 0 : 0.06,
          shadowRadius: 8,
          elevation: 0, // no Android elevation (more iOS-like)
        },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          ...Typography.caption,
          fontWeight: '600',
          fontSize: 10,
          marginTop: 2,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Swipe',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person" focused={focused} activeColor={activeColor} inactiveColor={inactiveColor} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="chatbubble"
              focused={focused}
              badge={totalUnread}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={GroupChatListScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="people" focused={focused} activeColor={activeColor} inactiveColor={inactiveColor} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-circle" focused={focused} activeColor={activeColor} inactiveColor={inactiveColor} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
