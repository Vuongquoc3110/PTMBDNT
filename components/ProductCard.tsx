import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useAppContext } from '@/context/AppContext';
import { formatPrice, getProductFallbackImage, isInvalidOrBlockedImageUrl } from '@/data/products';

const SAFE_DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=85';

function getProductImageUri(product: any) {
  const directImage = product?.image || product?.images?.[0];
  if (!directImage || isInvalidOrBlockedImageUrl(directImage)) {
    const fallback = getProductFallbackImage(product);
    return fallback && !isInvalidOrBlockedImageUrl(fallback) ? fallback : SAFE_DEFAULT_IMAGE;
  }
  return directImage;
}

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
  const [imageUri, setImageUri] = useState(() => getProductImageUri(product));
  const isFav = isWishlisted(product.id);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  React.useEffect(() => {
    setImageUri(getProductImageUri(product));
  }, [product?.id, product?.name, product?.category, product?.image, product?.images?.[0]]);

  return (
    <Link href={{ pathname: '/products/[id]', params: { id: product.id } }} asChild>
      <Pressable
        style={StyleSheet.flatten([styles.card, isMobile && styles.cardMobile])}
        {...({ dataSet: { productCard: 'true' } } as any)}
      >
        <View style={styles.imageWrap}>
          <Image
            key={imageUri}
            source={{ uri: imageUri }}
            style={[styles.image, isMobile && styles.imageMobile]}
            resizeMode="contain"
            onError={() => {
              const fallback = getProductFallbackImage(product);
              if (imageUri !== fallback && !isInvalidOrBlockedImageUrl(fallback)) {
                setImageUri(fallback);
              } else if (imageUri !== SAFE_DEFAULT_IMAGE) {
                setImageUri(SAFE_DEFAULT_IMAGE);
              }
            }}
            {...({ dataSet: { productImg: 'true' }, referrerPolicy: 'no-referrer' } as any)}
          />
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
        <View style={styles.priceBlock}>
          {product.oldPrice ? (
            <View style={styles.priceTopRow}>
              <Text style={[styles.oldPrice, isMobile && { fontSize: 11 }]}>{formatPrice(product.oldPrice)}</Text>
              {product.discount ? (
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>−{product.discount}%</Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <Text style={[styles.price, isMobile && styles.priceMobile]}>{formatPrice(product.price)}</Text>
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
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  imageMobile: {
    height: 125,
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
  priceBlock: {
    marginTop: 10,
    gap: 2,
  },
  priceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  discountPill: {
    backgroundColor: '#fff1e6',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  discountPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ea580c',
    letterSpacing: 0.2,
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
