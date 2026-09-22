import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { AuthRequiredModal } from '@/components/AuthRequiredModal';
import { formatPrice } from '@/data/products';
import { useAppContext } from '@/context/AppContext';
import { useProducts } from '@/hooks/useApi';

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist, toggleWishlist, addToCart, user } = useAppContext();
  const { products, loading } = useProducts();
  const [authModalVisible, setAuthModalVisible] = useState(false);

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <Header />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Danh sách yêu thích</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{wishlistedProducts.length} sản phẩm</Text>
          </View>
        </View>

        {wishlistedProducts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="heart-dislike-outline" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
            <Text style={styles.emptyDesc}>
              Nhấn vào biểu tượng trái tim trên các sản phẩm bạn thích để lưu lại và xem lại bất kỳ lúc nào.
            </Text>
            <Pressable style={styles.exploreBtn} onPress={() => router.push('/products' as any)}>
              <Text style={styles.exploreBtnText}>Khám phá sản phẩm</Text>
            </Pressable>
          </View>
        ) : (
          wishlistedProducts.map((item) => (
            <View key={item.id} style={styles.card}>
              <Link href={{ pathname: '/products/[id]', params: { id: item.id } }} asChild>
                <Pressable style={styles.cardLeft}>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.category}>{item.category || item.category_id}</Text>
                    <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                  </View>
                </Pressable>
              </Link>

              <View style={styles.actionCol}>
                <Pressable
                  style={styles.addCartBtn}
                  onPress={() => {
                    if (!user) {
                      router.push('/login' as any);
                      return;
                    }
                    addToCart(item, 1);
                    alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
                  }}
                >
                  <Ionicons name="cart-outline" size={18} color="#2563eb" />
                  <Text style={styles.addCartText}>Thêm vào giỏ</Text>
                </Pressable>

                <Pressable
                  style={styles.removeBtn}
                  onPress={() => toggleWishlist(item.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <AuthRequiredModal
        visible={authModalVisible}
        onClose={() => setAuthModalVisible(false)}
        message="Bạn cần đăng nhập tài khoản để thêm sản phẩm vào giỏ hàng."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { maxWidth: 900, width: '100%', alignSelf: 'center', padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  countBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  countBadgeText: { color: '#2563eb', fontWeight: '700', fontSize: 13 },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 20,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 14 },
  emptyDesc: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 8, maxWidth: 400, lineHeight: 20 },
  exploreBtn: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  image: { width: 85, height: 85, borderRadius: 14, backgroundColor: '#f8fafc' },
  info: { flex: 1, marginLeft: 14, paddingRight: 10 },
  category: { color: '#64748b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  name: { marginTop: 4, color: '#0f172a', fontSize: 15, fontWeight: '700' },
  price: { marginTop: 6, color: '#dc2626', fontWeight: '800', fontSize: 16 },

  actionCol: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  addCartText: { color: '#2563eb', fontWeight: '700', fontSize: 13 },
  removeBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
  },
});
