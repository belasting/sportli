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
      name={focused ? name : (`${name}-outline` as any)}
      size={26}
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
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '800',
    fontSize: 10,
  },
});

export const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 10,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          ...Typography.caption,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Swipe',
          tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} />,
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
        name="Group"
        component={GroupChatListScreen}
        options={{
          tabBarLabel: 'Groups',
          tabBarIcon: ({ focused }) => <TabIcon name="people" focused={focused} />,
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
