import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/context/AppContext';

// Hàm xác định URL chuẩn theo môi trường (Mobile: Expo Go / Android Emulator / iOS Simulator / Web)
export function getCategoriesApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return `${process.env.EXPO_PUBLIC_API_URL}/api/categories`;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:5000/api/categories`;
  }
  // Expo Go trên điện thoại thật cùng mạng Wi-Fi: tự lấy IP LAN của máy tính
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5000/api/categories`;
  }
  // Android Emulator (dùng 10.0.2.2 để gọi localhost của máy host)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/categories';
  }
  return 'http://localhost:5000/api/categories';
}

export type Category = {
  id: number | string;
  name: string;
  slug?: string;
  icon?: string;
  count?: number;
};

type CategoriesResponse = {
  success?: boolean;
  message?: string;
  data?: Category[];
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { isDark } = useAppContext();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCategories = useCallback(async (isRefresh = false) => {
    let isMounted = true;
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    const apiUrl = getCategoriesApiUrl();

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${response.status}`);
      }

      const result = await response.json();

      // Hỗ trợ cả 2 định dạng: wrapper { success, data } của thầy VÀ mảng thuần [ ... ] của json-server/Express
      let categoryList: Category[] = [];
      if (Array.isArray(result)) {
        categoryList = result;
      } else if (result && Array.isArray(result.data)) {
        if (result.success === false) {
          throw new Error(result.message || 'Không thể tải danh mục từ máy chủ');
        }
        categoryList = result.data;
      } else {
        throw new Error('Dữ liệu API trả về không đúng định dạng danh sách');
      }

      if (isMounted) {
        setCategories(categoryList);
        setErrorMessage(null);
      }
    } catch (error) {
      if (isMounted) {
        const msg = error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ';
        setErrorMessage(
          `${msg}. Hãy kiểm tra xem Backend (cổng 5000/3000) đã bật chưa và điện thoại có cùng Wi-Fi với máy tính không.`
        );
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <ThemedView style={[styles.container, isDark && styles.containerDark]}>
      {/* HEADER SECTION */}
      <View style={styles.header}>
        <ThemedText type="title" style={styles.heading}>
          Danh mục sản phẩm
        </ThemedText>
        <ThemedText style={[styles.subheading, isDark && styles.textMutedDark]}>
          Dữ liệu tải trực tiếp từ API Backend qua Fetch
        </ThemedText>
      </View>

      {/* BODY CONTENT */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563eb" />
          <ThemedText style={styles.loadingText}>Đang tải danh mục từ máy chủ...</ThemedText>
        </View>
      ) : errorMessage ? (
        <View style={styles.centerBox}>
          <View style={styles.errorIconWrap}>
            <Ionicons name="cloud-offline-outline" size={36} color="#ef4444" />
          </View>
          <ThemedText style={styles.errorTitle}>Lỗi kết nối API</ThemedText>
          <ThemedText style={styles.errorDescription}>{errorMessage}</ThemedText>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadCategories()}
          >
            <Ionicons name="reload-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <ThemedText style={styles.retryButtonText}>Thử lại ngay</ThemedText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(category) => String(category.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadCategories(true)}
              colors={['#2563eb']}
              tintColor="#2563eb"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="file-tray-outline" size={40} color="#94a3b8" />
              <ThemedText style={styles.emptyText}>Chưa có danh mục nào trong cơ sở dữ liệu.</ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                router.push({
                  pathname: '/products',
                  params: { category: item.slug || String(item.id) },
                } as any);
              }}
              style={StyleSheet.flatten([
                styles.categoryCard,
                isDark && styles.categoryCardDark,
              ])}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconWrap, isDark && styles.iconWrapDark]}>
                  <Ionicons name="layers-outline" size={20} color="#2563eb" />
                </View>
                <View style={styles.cardTextGroup}>
                  <ThemedText style={styles.categoryName}>{item.name}</ThemedText>
                  <ThemedText style={[styles.categorySlug, isDark && styles.textMutedDark]}>
                    {item.slug || `ID: ${item.id}`}
                    {typeof item.count === 'number' ? ` • ${item.count} sản phẩm` : ''}
                  </ThemedText>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={18} color={isDark ? '#64748b' : '#94a3b8'} />
            </Pressable>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  list: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDark: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
  },
  cardTextGroup: {
    flex: 1,
    gap: 2,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  categorySlug: {
    color: '#64748b',
    fontSize: 13,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  textMutedDark: {
    color: '#94a3b8',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
});
