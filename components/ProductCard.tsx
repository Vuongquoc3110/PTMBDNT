import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { formatPrice } from '@/data/products';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80';

function getBadgeInfo(product: any) {
  if (product.isSale) return { text: `−${product.discount}%`, bg: '#dc2626', color: '#fff' };
  if (product.isNew) return { text: 'MỚI', bg: '#2563eb', color: '#fff' };
  if (product.isHot) return { text: 'HOT', bg: '#f97316', color: '#fff' };
  return { text: '', bg: 'transparent', color: 'transparent' };
}

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const { toggleWishlist, isWishlisted, user } = useAppContext();
  const badge = getBadgeInfo(product);
  const [imageUri, setImageUri] = useState(product.image || DEFAULT_IMAGE);
  const isFav = isWishlisted(product.id);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <Link href={{ pathname: '/products/[id]', params: { id: product.id } }} asChild>
      <Pressable
        style={StyleSheet.flatten([styles.card, isMobile && styles.cardMobile])}
        {...({ dataSet: { productCard: 'true' } } as any)}
      >
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, isMobile && styles.imageMobile]}
            onError={() => setImageUri(DEFAULT_IMAGE)}
            {...({ dataSet: { productImg: 'true' } } as any)}
          />
          {badge.text ? (
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, isMobile && { fontSize: 10 }]}>{badge.text}</Text>
            </View>
          ) : null}
          <Pressable
            style={[styles.favorite, isFav && styles.favoriteActive]}
            {...({ dataSet: { productFav: 'true' } } as any)}
            onPress={(e) => {
              e?.stopPropagation?.();
              if (!user) {
                router.push('/login' as any);
                return;
              }
              toggleWishlist(product.id);
            }}
          >
            <Text style={[styles.favoriteIcon, isFav && { color: '#e11d48' }]}>
              {isFav ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
        <Text
          style={[styles.name, isMobile && styles.nameMobile]}
          numberOfLines={2}
          {...({ dataSet: { productName: 'true' } } as any)}
        >
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.ratingNum}>{product.rating}</Text>
          <Text style={styles.reviewCount}>({product.reviewCount})</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={[styles.price, isMobile && styles.priceMobile]}>{formatPrice(product.price)}</Text>
          {product.oldPrice ? <Text style={[styles.oldPrice, isMobile && { fontSize: 11 }]}>{formatPrice(product.oldPrice)}</Text> : null}
        </View>
        <View style={styles.stockRow}>
          <View
            style={[
              styles.stockDot,
              {
                backgroundColor:
                  product.stock > 10 ? '#22c55e' : product.stock > 0 ? '#f59e0b' : '#ef4444',
              },
            ]}
          />
          <Text style={styles.stockText}>
            {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? `Còn ${product.stock} sp` : 'Hết hàng'}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    padding: 12,
    width: '100%',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  cardMobile: {
    borderRadius: 16,
    padding: 10,
  },
  cardHovered: {
    borderColor: '#93c5fd',
    shadowColor: '#2563eb',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 8,
  },
  imageWrap: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 16,
  },
  imageMobile: {
    height: 125,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    zIndex: 2,
  },
  badgeText: {
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  favorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  favoriteActive: {
    backgroundColor: '#ffe4e6',
  },
  favoriteIcon: {
    fontSize: 16,
    color: '#ef4444',
  },
  name: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 12,
    lineHeight: 20,
    transition: 'color 0.25s ease',
  } as any,
  nameMobile: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  nameHovered: {
    color: '#2563eb',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  stars: {
    color: '#f59e0b',
    fontSize: 12,
  },
  ratingNum: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 12,
  },
  reviewCount: {
    color: '#94a3b8',
    fontSize: 11,
  },
  priceRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  price: {
    color: '#dc2626',
    fontWeight: '800',
    fontSize: 17,
  },
  priceMobile: {
    fontSize: 14,
  },
  oldPrice: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
});
