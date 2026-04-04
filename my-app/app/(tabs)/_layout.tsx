import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, router } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useEffect } from 'react';
import { getToken } from '@/lib/tokenStorage';
import Colors from '../../constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  // Auth guard — kick to login if no token
  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      if (!token) router.replace('/(auth)/AuthPage');
    }
    checkAuth();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable static header render on web to prevent React Navigation v6 hydration error
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Quiz',
          tabBarIcon: ({ color }) => <TabBarIcon name="question-circle" color={color} />,
        }}
      />
      {/* These screens are in the (app) group — exposed here as deep-links */}
      {/* Tabs.Screen entries below keep the navigator aware of them without rendering a tab button */}
      <Tabs.Screen
        name="Dashboard"
        options={{
          href: null, // hidden from tab bar — access via (app)/Dashboard
        }}
      />
      <Tabs.Screen
        name="MealLibrary"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="MealPackages"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}