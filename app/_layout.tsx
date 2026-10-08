import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { SupportChatWidget } from '@/components/SupportChatWidget';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { Platform } from 'react-native';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // Inject no-referrer policy so CDNs don't block image hotlinking
  const metaReferrerId = 'no-referrer-meta';
  if (!document.getElementById(metaReferrerId)) {
    const meta = document.createElement('meta');
    meta.id = metaReferrerId;
    meta.name = 'referrer';
    meta.content = 'no-referrer';
    document.head.prepend(meta);
  }

  // Inject Be Vietnam Pro font from Google Fonts
  const fontLinkId = 'be-vietnam-pro-font';
  if (!document.getElementById(fontLinkId)) {
    const link = document.createElement('link');
    link.id = fontLinkId;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap';
    document.head.appendChild(link);
  }

  const styleId = 'product-card-hover-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      /* Apply Be Vietnam Pro to text elements — no !important so icon inline styles win */
      body, p, div, h1, h2, h3, h4, h5, h6, a, button, input, textarea, select, label, li, td, th {
        font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      [data-product-card] {
        transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s ease, border-color 0.35s ease !important;
        cursor: pointer !important;
      }
      [data-product-card]:hover {
        transform: translateY(-7px) !important;
        box-shadow: 0 18px 36px -4px rgba(37, 99, 235, 0.22) !important;
        border-color: #93c5fd !important;
      }
      [data-product-card]:hover [data-product-img] {
        transform: scale(1.12) !important;
      }
      [data-product-card]:hover [data-product-fav] {
        transform: scale(1.15) !important;
      }
      [data-product-card]:hover [data-product-name] {
        color: #2563eb !important;
      }
      [data-product-img] {
        transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1) !important;
        will-change: transform;
      }
      [data-product-fav] {
        transition: transform 0.3s ease !important;
      }
      [data-product-name] {
        transition: color 0.25s ease !important;
      }
      [data-nav-item] {
        cursor: pointer !important;
        transition: background-color 0.2s ease, transform 0.15s ease !important;
      }
      [data-nav-item]:hover {
        background-color: #eff6ff !important;
      }
      [data-nav-item]:hover [data-nav-text] {
        color: #2563eb !important;
      }
      [data-account-btn] {
        cursor: pointer !important;
        transition: opacity 0.15s ease, transform 0.12s ease !important;
      }
      [data-account-btn]:hover {
        opacity: 0.9 !important;
      }
      [data-account-btn]:active {
        transform: scale(0.97) !important;
      }
      [data-user-menu-item] {
        cursor: pointer !important;
        transition: background-color 0.15s ease, transform 0.1s ease !important;
      }
      [data-user-menu-item]:hover {
        background-color: #f1f5f9 !important;
      }
      [data-user-menu-item]:active {
        transform: scale(0.98) !important;
      }
      [data-app-theme="dark"] [data-user-menu-item]:hover {
        background-color: #27272a !important;
      }
      [data-filter-sidebar-row] {
        cursor: pointer !important;
        transition: background-color 0.15s ease, transform 0.1s ease !important;
      }
      [data-filter-sidebar-row]:hover {
        background-color: #f1f5f9 !important;
      }
      [data-filter-sidebar-row]:active {
        transform: scale(0.99) !important;
      }
      [data-app-theme="dark"] [data-filter-sidebar-row]:hover {
        background-color: #1e293b !important;
      }
      [data-category-sidebar-item] {
        cursor: pointer !important;
        transition: all 0.16s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
      [data-category-sidebar-item]:hover {
        background-color: #eff6ff !important;
        transform: translateX(3px) !important;
      }
      [data-category-sidebar-item]:hover [data-category-sidebar-text] {
        color: #2563eb !important;
      }
      [data-category-sidebar-item]:hover [data-category-sidebar-icon] {
        background-color: #dbeafe !important;
        transform: scale(1.08) !important;
      }
      [data-category-sidebar-item]:hover [data-category-sidebar-arrow] {
        color: #2563eb !important;
        transform: translateX(2px) !important;
      }
      [data-category-sidebar-item]:active {
        transform: scale(0.98) !important;
      }
      [data-app-theme="dark"] [data-category-sidebar-item]:hover {
        background-color: #1e3a8a30 !important;
      }
      [data-app-theme="dark"] [data-category-sidebar-item]:hover [data-category-sidebar-text] {
        color: #60a5fa !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}

function RootNavigator() {
  const { isDark } = useAppContext();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <SupportChatWidget />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
