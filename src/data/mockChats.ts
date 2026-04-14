import { Conversation } from '../types';
import { MOCK_USERS } from './mockUsers';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    matchedUser: MOCK_USERS[0],
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: MOCK_USERS[0].id,
        text: "Hey! Saw you're into basketball too 🏀",
        timestamp: new Date(Date.now() - 3600000 * 2),
        isRead: true,
      },
      {
        id: 'm2',
        senderId: 'me',
        text: 'Yess! Always looking for pickup games. You play in any local courts?',
        timestamp: new Date(Date.now() - 3600000 * 1.5),
        isRead: true,
      },
      {
        id: 'm3',
        senderId: MOCK_USERS[0].id,
        text: 'Yeah, I play at Prospect Park on Saturdays around 10am. You should come!',
        timestamp: new Date(Date.now() - 1800000),
        isRead: true,
      },
      {
        id: 'm4',
        senderId: MOCK_USERS[0].id,
        text: "We usually need one more player anyway 😄",
        timestamp: new Date(Date.now() - 900000),
        isRead: false,
      },
    ],
  },
  {
    id: 'conv2',
    matchedUser: MOCK_USERS[1],
    unreadCount: 0,
    messages: [
      {
        id: 'm5',
        senderId: 'me',
        text: "Love your tennis game vibe! We should hit the courts sometime",
        timestamp: new Date(Date.now() - 86400000),
        isRead: true,
      },
      {
        id: 'm6',
        senderId: MOCK_USERS[1].id,
        text: "That would be amazing! I'm free Thursday afternoon 🎾",
        timestamp: new Date(Date.now() - 82800000),
        isRead: true,
      },
    ],
  },
  {
    id: 'conv3',
    matchedUser: MOCK_USERS[2],
    unreadCount: 1,
    messages: [
      {
        id: 'm7',
        senderId: MOCK_USERS[2].id,
        text: 'Morning runs or evening runs for you?',
        timestamp: new Date(Date.now() - 43200000),
        isRead: true,
      },
      {
        id: 'm8',
        senderId: 'me',
        text: 'Definitely morning! Pre-8am or I skip it lol',
        timestamp: new Date(Date.now() - 40000000),
        isRead: true,
      },
      {
        id: 'm9',
        senderId: MOCK_USERS[2].id,
        text: 'Same!! 6am Central Park run this Saturday? 🏃‍♂️',
        timestamp: new Date(Date.now() - 7200000),
        isRead: false,
      },
    ],
  },
  {
    id: 'conv4',
    matchedUser: MOCK_USERS[3],
    unreadCount: 0,
    messages: [
      {
        id: 'm10',
        senderId: MOCK_USERS[3].id,
        text: "It's a match! ⚽ Do you play Sunday leagues?",
        timestamp: new Date(Date.now() - 172800000),
        isRead: true,
      },
    ],
  },
  {
    id: 'conv5',
    matchedUser: MOCK_USERS[5],
    unreadCount: 3,
    messages: [
      {
        id: 'm11',
        senderId: MOCK_USERS[5].id,
        text: 'Have you tried combining yoga with your running routine?',
        timestamp: new Date(Date.now() - 21600000),
        isRead: true,
      },
      {
        id: 'm12',
        senderId: 'me',
        text: "No but I should, I'm always so stiff after long runs",
        timestamp: new Date(Date.now() - 18000000),
        isRead: true,
      },
      {
        id: 'm13',
        senderId: MOCK_USERS[5].id,
        text: "I teach a class on Wednesdays perfect for runners! 🧘",
        timestamp: new Date(Date.now() - 14400000),
        isRead: false,
      },
      {
        id: 'm14',
        senderId: MOCK_USERS[5].id,
        text: "It's free for the first session 😊",
        timestamp: new Date(Date.now() - 10800000),
        isRead: false,
      },
      {
        id: 'm15',
        senderId: MOCK_USERS[5].id,
        text: "Let me know if you're interested!",
        timestamp: new Date(Date.now() - 3600000),
        isRead: false,
      },
    ],
  },
];
