import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCategories, useProducts } from '@/hooks/useApi';

function FlashSaleCountdown() {
	const [timeLeft, setTimeLeft] = useState({ h: 5, m: 32, s: 18 });

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				let { h, m, s } = prev;
				s--;
				if (s < 0) { s = 59; m--; }
				if (m < 0) { m = 59; h--; }
				if (h < 0) { h = 23; m = 59; s = 59; }
				return { h, m, s };
			});
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const pad = (n: number) => n.toString().padStart(2, '0');
	return (
		<View style={styles.countdownRow}>
			<View style={styles.countdownBox}><Text style={styles.countdownNum}>{pad(timeLeft.h)}</Text></View>
			<Text style={styles.countdownSep}>:</Text>
			<View style={styles.countdownBox}><Text style={styles.countdownNum}>{pad(timeLeft.m)}</Text></View>
			<Text style={styles.countdownSep}>:</Text>
			<View style={styles.countdownBox}><Text style={styles.countdownNum}>{pad(timeLeft.s)}</Text></View>
		</View>
	);
}

export default function HomeScreen() {
	const { width } = useWindowDimensions();
	const isDesktop = width >= 768;

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(30)).current;

	const { products } = useProducts();
	const { categories } = useCategories();

	const flashSaleProducts = products.filter((p: any) => p.isSale || (p.discount && p.discount > 0)).slice(0, 8);
	const featuredProducts = products.filter((p: any) => p.isFeatured).slice(0, 8);
	const newArrivals = products.filter((p: any) => p.isNew).slice(0, 8);

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
			Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
		]).start();
	}, [fadeAnim, slideAnim]);

	return (
		<View style={styles.page}>
			<Header />
			<ScrollView style={styles.container} contentContainerStyle={[styles.content, !isDesktop && styles.contentMobile]}>
				{/* Hero Banner */}
				<Animated.View style={[styles.heroCard, !isDesktop && styles.heroCardMobile, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
					<View style={[styles.heroTextWrap, !isDesktop && styles.heroTextWrapMobile]}>
						<Text style={styles.eyebrow}>NÂNG CẤP SETUP CỦA BẠN</Text>
						<Text style={[styles.heroTitle, !isDesktop && styles.heroTitleMobile]}>Máy tính mạnh mẽ cho công việc, gaming và sáng tạo.</Text>
						<Text style={[styles.heroSubtitle, !isDesktop && styles.heroSubtitleMobile]}>Khám phá laptop và linh kiện máy tính hiệu năng cao, thiết kế hiện đại và bền bỉ.</Text>
						<View style={[styles.heroActions, !isDesktop && styles.heroActionsMobile]}>
							<Link href={'/products' as any} style={StyleSheet.flatten([styles.primaryBtn, !isDesktop && styles.btnMobile])}>
								<Text style={styles.primaryBtnText}>MUA NGAY</Text>
							</Link>
							<Link href={'/products' as any} style={StyleSheet.flatten([styles.secondaryBtn, !isDesktop && styles.btnMobile])}>
								<Text style={styles.secondaryBtnText}>KHUYẾN MÃI</Text>
							</Link>
						</View>
					</View>
					<View style={[styles.heroVisual, !isDesktop && styles.heroVisualMobile]}>
						<Image
							source={{ uri: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80' }}
							style={styles.heroImage}
						/>
						<View style={styles.heroBadge}>
							<Text style={styles.heroBadgeText}>DANGVINHPC</Text>
							<Text style={styles.heroBadgeSub}>Mới nhất 2026</Text>
						</View>
					</View>
				</Animated.View>

				{/* Categories */}
				<View style={styles.sectionHeader}>
					<Text style={[styles.sectionTitle, !isDesktop && styles.sectionTitleMobile]}>Danh mục nổi bật</Text>
					<Link href={'/products' as any} style={styles.sectionLink}>Xem tất cả</Link>
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
					{(categories.length > 0 ? categories : [
						{ id: 'laptop', name: 'Laptop', icon: 'laptop-outline', count: 28 },
						{ id: 'gaming-pc', name: 'PC Gaming', icon: 'desktop-outline', count: 16 },
						{ id: 'cpu', name: 'CPU', icon: 'hardware-chip-outline', count: 20 },
						{ id: 'gpu', name: 'GPU', icon: 'game-controller-outline', count: 18 },
						{ id: 'ram', name: 'RAM', icon: 'albums-outline', count: 14 },
						{ id: 'ssd', name: 'SSD', icon: 'save-outline', count: 22 },
						{ id: 'monitor', name: 'Màn hình', icon: 'tv-outline', count: 15 },
						{ id: 'keyboard', name: 'Bàn phím', icon: 'keypad-outline', count: 19 },
					]).map((cat, idx) => {
						const colors = ['#2563eb', '#7c3aed', '#ea580c', '#059669', '#2563eb', '#0891b2', '#7c3aed', '#d97706'];
						const bgs = ['#edf6ff', '#f5f3ff', '#fff7ed', '#effaf5', '#edf6ff', '#ecfeff', '#f5f3ff', '#fef3c7'];
						const color = colors[idx % colors.length];
						const bg = bgs[idx % bgs.length];
						return (
							<Link
								key={cat.id || cat.name}
								href={{ pathname: '/products', params: { category: cat.id || cat.name } } as any}
								asChild
							>
								<Pressable>
									<View style={[styles.categoryCard, !isDesktop && styles.categoryCardMobile, { backgroundColor: bg }]}>
										<View style={{ marginBottom: 6 }}>
											<Ionicons
												name={
													cat.icon?.includes('-outline')
														? (cat.icon as any)
														: cat.id === 'laptop'
														? 'laptop-outline'
														: cat.id === 'cpu'
														? 'hardware-chip-outline'
														: cat.id === 'gpu'
														? 'game-controller-outline'
														: 'desktop-outline'
												}
												size={isDesktop ? 28 : 24}
												color={color}
											/>
										</View>
										<Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
										<Text style={styles.categoryCount}>{cat.count} sp</Text>
									</View>
								</Pressable>
							</Link>
						);
					})}
				</ScrollView>

				{/* Flash Sale */}
				<View style={styles.sectionHeader}>
					<View style={styles.flashSaleHeader}>
						<Text style={styles.flashSaleIcon}>⚡</Text>
						<Text style={[styles.sectionTitle, !isDesktop && styles.sectionTitleMobile]}>Flash Sale</Text>
					</View>
					<FlashSaleCountdown />
				</View>

				<View style={styles.gridList}>
					{flashSaleProducts.map((product) => (
						<View key={product.id} style={isDesktop ? styles.gridItemDesktop : styles.gridItemMobile}>
							<ProductCard product={product} />
						</View>
					))}
				</View>

				{/* Featured */}
				<View style={styles.sectionHeader}>
					<Text style={[styles.sectionTitle, !isDesktop && styles.sectionTitleMobile]}>Sản phẩm nổi bật</Text>
					<Link href={'/products' as any} style={styles.sectionLink}>Xem tất cả</Link>
				</View>

				<View style={styles.gridList}>
					{featuredProducts.map((product) => (
						<View key={product.id} style={isDesktop ? styles.gridItemDesktop : styles.gridItemMobile}>
							<ProductCard product={product} />
						</View>
					))}
				</View>

				{/* New Arrivals */}
				<View style={styles.sectionHeader}>
					<Text style={[styles.sectionTitle, !isDesktop && styles.sectionTitleMobile]}>Sản phẩm mới</Text>
					<Link href={'/products' as any} style={styles.sectionLink}>Xem tất cả</Link>
				</View>

				<View style={styles.gridList}>
					{newArrivals.map((product) => (
						<View key={product.id} style={isDesktop ? styles.gridItemDesktop : styles.gridItemMobile}>
							<ProductCard product={product} />
						</View>
					))}
				</View>

				{/* Deal Banner */}
				<View style={[styles.dealBanner, !isDesktop && styles.dealBannerMobile]}>
					<View style={!isDesktop && { flex: 1 }}>
						<Text style={styles.dealEyebrow}>DANGVINHPC DEALS</Text>
						<Text style={[styles.dealTitle, !isDesktop && styles.dealTitleMobile]}>Nâng cấp setup của bạn</Text>
						<Text style={[styles.dealSubtitle, !isDesktop && styles.dealSubtitleMobile]}>Tiết kiệm lên đến 30% cho các sản phẩm đã chọn.</Text>
					</View>
					<Link href={'/products' as any} style={StyleSheet.flatten([styles.dealButton, !isDesktop && styles.dealButtonMobile])}>
						<Text style={styles.dealButtonText}>MUA DEAL</Text>
					</Link>
				</View>

				{/* Footer */}
				<View style={[styles.footer, !isDesktop && styles.footerMobile]}>
					<View style={styles.footerBlock}>
						<Text style={styles.footerBrand}>DANGVINHPC</Text>
						<Text style={styles.footerText}>Cửa hàng máy tính & công nghệ chính hãng</Text>
					</View>
					<View style={styles.footerBlock}>
						<Text style={styles.footerTitle}>Liên kết nhanh</Text>
						<Text style={styles.footerText}>Trang chủ</Text>
						<Text style={styles.footerText}>Sản phẩm</Text>
						<Text style={styles.footerText}>Danh mục</Text>
					</View>
					<View style={styles.footerBlock}>
						<Text style={styles.footerTitle}>Hỗ trợ</Text>
						<Text style={styles.footerText}>Liên hệ</Text>
						<Text style={styles.footerText}>Vận chuyển</Text>
						<Text style={styles.footerText}>Đổi trả</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#f4f8ff',
	},
	container: {
		flex: 1,
		backgroundColor: '#f4f8ff',
	},
	content: {
		padding: 20,
		paddingBottom: 100,
	},
	contentMobile: {
		paddingHorizontal: 12,
		paddingTop: 14,
		paddingBottom: 90,
	},
	heroCard: {
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#dfeafc',
		borderRadius: 28,
		padding: 24,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		shadowColor: '#60a5fa',
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 4,
		overflow: 'hidden',
	},
	heroCardMobile: {
		flexDirection: 'column',
		padding: 14,
		borderRadius: 20,
		marginBottom: 16,
	},
	heroTextWrap: {
		flex: 1,
		paddingRight: 16,
	},
	heroTextWrapMobile: {
		paddingRight: 0,
		width: '100%',
	},
	eyebrow: {
		color: '#2563eb',
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 1,
	},
	heroTitle: {
		marginTop: 12,
		color: '#0f172a',
		fontSize: 32,
		fontWeight: '800',
		lineHeight: 40,
	},
	heroTitleMobile: {
		fontSize: 21,
		lineHeight: 28,
		marginTop: 8,
	},
	heroSubtitle: {
		marginTop: 12,
		color: '#475569',
		fontSize: 15,
		lineHeight: 22,
	},
	heroSubtitleMobile: {
		fontSize: 13,
		lineHeight: 18,
		marginTop: 6,
	},
	heroActions: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 18,
	},
	heroActionsMobile: {
		gap: 8,
		marginTop: 14,
	},
	primaryBtn: {
		backgroundColor: '#2563eb',
		borderRadius: 12,
		paddingHorizontal: 20,
		paddingVertical: 12,
		textAlign: 'center',
	},
	btnMobile: {
		flex: 1,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	primaryBtnText: {
		color: '#ffffff',
		fontWeight: '800',
		fontSize: 13,
		textAlign: 'center',
	},
	secondaryBtn: {
		borderWidth: 1.5,
		borderColor: '#cbd5e1',
		borderRadius: 12,
		paddingHorizontal: 20,
		paddingVertical: 12,
		textAlign: 'center',
	},
	secondaryBtnText: {
		color: '#0f172a',
		fontWeight: '700',
		fontSize: 13,
		textAlign: 'center',
	},
	heroVisual: {
		width: 280,
		height: 220,
		borderRadius: 22,
		overflow: 'hidden',
		position: 'relative',
	},
	heroVisualMobile: {
		width: '100%',
		height: 164,
		borderRadius: 16,
		marginTop: 14,
	},
	heroImage: {
		width: '100%',
		height: '100%',
		borderRadius: 22,
	},
	heroBadge: {
		position: 'absolute',
		bottom: 12,
		left: 12,
		backgroundColor: 'rgba(15, 23, 42, 0.85)',
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 8,
	},
	heroBadgeText: {
		color: '#ffffff',
		fontWeight: '800',
		fontSize: 12,
		letterSpacing: 1,
	},
	heroBadgeSub: {
		color: '#94a3b8',
		fontSize: 11,
		marginTop: 2,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 24,
		marginBottom: 12,
	},
	sectionHeaderMobile: {
		marginTop: 20,
	},
	flashSaleHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	flashSaleIcon: {
		fontSize: 22,
	},
	sectionTitle: {
		color: '#0f172a',
		fontSize: 22,
		fontWeight: '800',
	},
	sectionTitleMobile: {
		fontSize: 18,
		flexShrink: 1,
	},
	sectionLink: {
		color: '#2563eb',
		fontWeight: '700',
		fontSize: 13,
	},
	countdownRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	countdownBox: {
		backgroundColor: '#0f172a',
		borderRadius: 8,
		paddingHorizontal: 7,
		paddingVertical: 3,
		minWidth: 28,
		alignItems: 'center',
	},
	countdownNum: {
		color: '#ffffff',
		fontWeight: '800',
		fontSize: 13,
	},
	countdownSep: {
		color: '#0f172a',
		fontWeight: '800',
		fontSize: 14,
	},
	categoryScroll: {
		gap: 10,
		paddingVertical: 4,
	},
	categoryCard: {
		width: 120,
		paddingVertical: 18,
		paddingHorizontal: 12,
		borderRadius: 18,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		alignItems: 'center',
		justifyContent: 'center',
	},
	categoryCardMobile: {
		width: 95,
		paddingVertical: 12,
		paddingHorizontal: 8,
		borderRadius: 14,
	},
	categoryName: {
		color: '#0f172a',
		fontWeight: '700',
		fontSize: 12,
	},
	categoryCount: {
		marginTop: 3,
		color: '#475569',
		fontSize: 10,
	},
	gridList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		paddingVertical: 4,
	},
	gridItemDesktop: {
		width: '23.8%', // 4 items per row on PC
		marginBottom: 16,
	},
	gridItemMobile: {
		width: '48.5%', // 2 items per row on Mobile
		marginBottom: 12,
	},
	dealBanner: {
		marginTop: 26,
		backgroundColor: '#0f172a',
		borderRadius: 24,
		padding: 24,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	dealBannerMobile: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: 16,
		padding: 18,
		borderRadius: 18,
	},
	dealEyebrow: {
		color: '#60a5fa',
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 1,
	},
	dealTitle: {
		marginTop: 8,
		color: '#ffffff',
		fontSize: 26,
		fontWeight: '800',
	},
	dealTitleMobile: {
		fontSize: 18,
		marginTop: 4,
	},
	dealSubtitle: {
		marginTop: 8,
		color: '#94a3b8',
		fontSize: 14,
	},
	dealSubtitleMobile: {
		fontSize: 12,
		marginTop: 4,
	},
	dealButton: {
		backgroundColor: '#2563eb',
		borderRadius: 12,
		paddingHorizontal: 20,
		paddingVertical: 14,
	},
	dealButtonMobile: {
		width: '100%',
		alignItems: 'center',
		paddingVertical: 12,
	},
	dealButtonText: {
		color: '#fff',
		fontWeight: '800',
		fontSize: 14,
		textAlign: 'center',
	},
	footer: {
		marginTop: 30,
		paddingTop: 20,
		borderTopWidth: 1,
		borderTopColor: '#dfeafc',
		flexDirection: 'row',
		justifyContent: 'space-between',
		gap: 20,
	},
	footerMobile: {
		flexDirection: 'column',
		gap: 16,
		marginTop: 20,
		paddingTop: 16,
	},
	footerBlock: {
		flex: 1,
	},
	footerBrand: {
		color: '#0f172a',
		fontSize: 20,
		fontWeight: '800',
	},
	footerTitle: {
		color: '#0f172a',
		fontWeight: '700',
		marginBottom: 6,
		fontSize: 14,
	},
	footerText: {
		color: '#475569',
		fontSize: 12,
		marginBottom: 4,
	},
});
