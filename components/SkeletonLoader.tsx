import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useAppContext } from '@/context/AppContext';

export function SkeletonBox({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
}) {
  const { isDark } = useAppContext();
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
  }, [opacityAnim]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
          opacity: Platform.OS !== 'web' ? opacityAnim : 1,
        },
        style,
      ])}
      {...({ className: 'dpc-shimmer' } as any)}
    />
  );
}

export function ProductCardSkeleton() {
  const { isDark } = useAppContext();

  return (
    <View style={StyleSheet.flatten([styles.productCard, isDark && styles.cardDark])}>
      {/* Image box */}
      <SkeletonBox width="100%" height={140} borderRadius={14} style={{ marginBottom: 12 }} />
      {/* Category tag */}
      <SkeletonBox width="40%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
      {/* Title lines */}
      <SkeletonBox width="90%" height={15} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width="65%" height={15} borderRadius={4} style={{ marginBottom: 12 }} />
      {/* Price */}
      <SkeletonBox width="50%" height={20} borderRadius={6} style={{ marginBottom: 12 }} />
      {/* Button */}
      <SkeletonBox width="100%" height={36} borderRadius={10} />
    </View>
  );
}

export function OrderCardSkeleton() {
  const { isDark } = useAppContext();

  return (
    <View style={StyleSheet.flatten([styles.orderCard, isDark && styles.cardDark])}>
      <View style={styles.orderHeader}>
        <SkeletonBox width={120} height={18} borderRadius={6} />
        <SkeletonBox width={80} height={22} borderRadius={12} />
      </View>
      <View style={styles.orderBody}>
        <SkeletonBox width={64} height={64} borderRadius={10} style={{ marginRight: 12 }} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBox width="85%" height={16} borderRadius={4} />
          <SkeletonBox width="45%" height={14} borderRadius={4} />
          <SkeletonBox width="30%" height={16} borderRadius={4} />
        </View>
      </View>
      <View style={styles.orderFooter}>
        <SkeletonBox width={100} height={14} borderRadius={4} />
        <SkeletonBox width={120} height={34} borderRadius={8} />
      </View>
    </View>
  );
}

export function CategoryCardSkeleton() {
  const { isDark } = useAppContext();

  return (
    <View style={StyleSheet.flatten([styles.categoryCard, isDark && styles.cardDark])}>
      <SkeletonBox width={44} height={44} borderRadius={12} style={{ marginBottom: 12 }} />
      <SkeletonBox width="70%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
      <SkeletonBox width="40%" height={12} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    width: '100%',
  },
  cardDark: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 14,
  },
  orderBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flex: 1,
  },
});
