import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';

import { useAppContext } from '@/context/AppContext';

function Sidebar({ isCollapsed, setIsCollapsed }: any) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin } = useAppContext();

  const routes = [
    { key: 'index', name: 'Trang chủ', icon: 'home-outline', path: '/' },
    { key: 'categories', name: 'Phân loại', icon: 'grid-outline', path: '/categories' },
    { key: 'explore', name: 'Đơn hàng', icon: 'receipt-outline', path: '/explore' },
    { key: 'user', name: 'Tài khoản', icon: 'person-outline', path: '/user' },
    ...(isAdmin ? [{ key: 'admin', name: 'Quản trị', icon: 'shield-outline', path: '/admin' }] : []),
  ];

  return (
    <View style={[styles.sidebar, { width: isCollapsed ? 80 : 260 }]}>
      <View style={[styles.logoContainer, isCollapsed && { paddingHorizontal: 0, alignItems: 'center' }]}>
        {isCollapsed ? (
          <Text style={styles.logoTextSmall}>DPC</Text>
        ) : (
          <Text style={styles.logoText}>DANGVINHPC</Text>
        )}
      </View>

      <Pressable onPress={() => setIsCollapsed(!isCollapsed)} style={[styles.collapseBtn, isCollapsed && { left: 28 }]}>
        <Ionicons name={isCollapsed ? "chevron-forward-outline" : "chevron-back-outline"} size={20} color="#64748b" />
      </Pressable>

      {routes.map((route) => {
        // Simple active check
        const isFocused = pathname === route.path || (pathname === '' && route.path === '/');
        const color = isFocused ? '#2563eb' : '#64748b';

        return (
          <Pressable
            key={route.key}
            onPress={() => router.push(route.path as any)}
            style={[styles.tabItem, isFocused && styles.tabItemActive, isCollapsed && { paddingHorizontal: 0, justifyContent: 'center' }]}
          >
            <Ionicons name={route.icon as any} color={color} size={24} />
            {!isCollapsed && (
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {route.name}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const tabsContent = (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isDesktop ? { display: 'none' } : {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Phân loại',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color, size }) => <Ionicons name="receipt-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index-api"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );

  if (isDesktop) {
    return (
      <View style={styles.layoutWrapper}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <View style={styles.mainContent}>
          {tabsContent}
        </View>
      </View>
    );
  }

  return tabsContent;
}

const styles = StyleSheet.create({
  layoutWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f8ff',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    paddingTop: 24,
    paddingHorizontal: 16,
    zIndex: 100,
  },
  logoContainer: {
    paddingHorizontal: 12,
    marginBottom: 40,
    marginTop: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 1,
  },
  logoTextSmall: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2563eb',
    letterSpacing: 1,
  },
  collapseBtn: {
    position: 'absolute',
    right: -14,
    top: 36,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  tabItemActive: {
    backgroundColor: '#eff6ff',
  },
  tabLabel: {
    marginLeft: 16,
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },
  tabLabelActive: {
    color: '#2563eb',
  },
});
