import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ChatListScreen } from '../screens/ChatListScreen';
import { GroupChatListScreen } from '../screens/GroupChatListScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MainTabParamList } from '../types';
import { Colors, Typography } from '../theme';
import { MOCK_CONVERSATIONS } from '../data/mockChats';
import { MOCK_GROUPS } from '../data/mockGroups';

const Tab = createBottomTabNavigator<MainTabParamList>();

const chatUnread = MOCK_CONVERSATIONS.reduce((acc, c) => acc + c.unreadCount, 0);
const groupUnread = MOCK_GROUPS.reduce((acc, g) => acc + g.unreadCount, 0);

const TabIcon = ({
  name,
  focused,
  badge,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  badge?: number;
}) => (
  <View style={tabStyles.iconWrapper}>
    <Ionicons
      name={focused ? name : (`${name}-outline` as keyof typeof Ionicons.glyphMap)}
      size={24}
      color={focused ? Colors.primary : Colors.textMuted}
    />
    {!!badge && (
      <View style={tabStyles.badge}>
        <Text style={tabStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    )}
  </View>
);

const tabStyles = StyleSheet.create({
  iconWrapper: {
    position: 'relative',
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -7,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 17,
    height: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  badgeText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 9,
    lineHeight: 12,
  },
});

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 26 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          ...Typography.caption,
          fontWeight: '600',
          marginTop: 2,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Swipe',
          tabBarIcon: ({ focused }) => <TabIcon name="flame" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="chatbubble-ellipses" focused={focused} badge={chatUnread} />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={GroupChatListScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ focused }) => (
            <TabIcon name="people" focused={focused} badge={groupUnread} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="person-circle" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
};
