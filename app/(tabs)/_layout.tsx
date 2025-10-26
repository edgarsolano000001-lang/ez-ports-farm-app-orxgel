
import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      route: '/(tabs)/(home)',
      label: 'Home',
      icon: 'house.fill',
    },
    {
      route: '/(tabs)/cart',
      label: 'Cart',
      icon: 'cart.fill',
    },
    {
      route: '/(tabs)/inbox',
      label: 'Inbox',
      icon: 'tray.fill',
    },
    {
      route: '/(tabs)/admin',
      label: 'Admin',
      icon: 'gear',
    },
  ];

  if (Platform.OS === 'ios') {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="inbox" />
          <Stack.Screen name="admin" />
        </Stack>
        <FloatingTabBar tabs={tabs} />
      </>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="inbox" />
        <Stack.Screen name="admin" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
