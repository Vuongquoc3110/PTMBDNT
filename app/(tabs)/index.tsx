import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HomeHeroBanners } from '@/components/HomeHeroBanners';
import { ProductCard } from '@/components/ProductCard';
import { GEAR_CATEGORIES, isProductInCategory, normalizeCategory } from '@/constants/categories';
import { useAppContext } from '@/context/AppContext';
import { useProducts } from '@/hooks/useApi';

function FlashSaleCountdown() {
	const [timeLeft, setTimeLeft] = useState({ h: 5, m: 32, s: 18 });
	const { isDark } = useAppContext();

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
			<View style={[styles.countdownBox, isDark && styles.countdownBoxDark]}><Text style={[styles.countdownNum, isDark && styles.countdownNumDark]}>{pad(timeLeft.h)}</Text></View>
			<Text style={[styles.countdownSep, isDark && styles.countdownSepDark]}>:</Text>
			<View style={[styles.countdownBox, isDark && styles.countdownBoxDark]}><Text style={[styles.countdownNum, isDark && styles.countdownNumDark]}>{pad(timeLeft.m)}</Text></View>
			<Text style={[styles.countdownSep, isDark && styles.countdownSepDark]}>:</Text>
			<View style={[styles.countdownBox, isDark && styles.countdownBoxDark]}><Text style={[styles.countdownNum, isDark && styles.countdownNumDark]}>{pad(timeLeft.s)}</Text></View>
		</View>
	);
}

const HOME_PROMOS = [
	{ icon: 'desktop-outline', title: 'Build PC theo nhu cầu', detail: 'Tư vấn cấu hình miễn phí', color: '#f97316' },
	{ icon: 'laptop-outline', title: 'Laptop chính hãng', detail: 'Nhiều quà tặng hấp dẫn', color: '#2563eb' },
	{ icon: 'game-controller-outline', title: 'Phụ kiện gaming', detail: 'Hoàn thiện góc setup', color: '#059669' },
];

const SERVICE_PROMISES = [
	{ icon: 'cube-outline', title: 'Giao hàng toàn quốc', detail: 'Đóng gói an toàn' },
	{ icon: 'shield-checkmark-outline', title: 'Bảo hành chính hãng', detail: 'An tâm sử dụng' },
	{ icon: 'card-outline', title: 'Thanh toán linh hoạt', detail: 'Nhiều hình thức' },
	{ icon: 'chatbubbles-outline', title: 'Tư vấn tận tâm', detail: 'Hỗ trợ chọn cấu hình' },
];

function getDailySeed(): number {
	const d = new Date();
	return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededShuffle<T>(array: T[], seed: number): T[] {
	const result = [...array];
	let s = seed;
	for (let i = result.length - 1; i > 0; i--) {
		s = (s * 9301 + 49297) % 233280;
		const rnd = s / 233280;
		const j = Math.floor(rnd * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export default function HomeScreen() {
	const { width } = useWindowDimensions();
	const isDesktop = width >= 768;
	const router = useRouter();

	const { selectedCategories, toggleCategoryFilter, clearCategoryFilter, isDark } = useAppContext();

	const { products } = useProducts();

	const filteredProducts = useMemo(() => {
		if (!products || selectedCategories.length === 0) return [];
		return products.filter((item: any) =>
			selectedCategories.some((catId) => isProductInCategory(item, catId))
		);
	}, [products, selectedCategories]);

	const { flashSaleProducts, featuredProducts, newArrivals } = useMemo(() => {
		if (!products || products.length === 0) {
			return { flashSaleProducts: [], featuredProducts: [], newArrivals: [] };
		}

		const todaySeed = getDailySeed();

		// 1. Flash Sale: Lọc hàng giảm giá, xoay vòng theo ngày
		const saleCandidates = products.filter((p: any) => p.isSale || (p.discount && p.discount > 0));
		const flashSale = seededShuffle(saleCandidates, todaySeed).slice(0, 8);
		const flashSaleIds = new Set(flashSale.map((p: any) => p.id));

		// 2. Sản phẩm nổi bật: Tuyệt đối KHÔNG TRÙNG với Flash Sale, xoay vòng ngẫu nhiên mỗi ngày
		const featuredCandidates = products.filter(
			(p: any) => !flashSaleIds.has(p.id) && (p.isFeatured || (p.rating && p.rating >= 4.7))
		);
		const featuredPool = featuredCandidates.length >= 8
			? featuredCandidates
			: products.filter((p: any) => !flashSaleIds.has(p.id));
		const featured = seededShuffle(featuredPool, todaySeed + 101).slice(0, 8);
		const featuredIds = new Set(featured.map((p: any) => p.id));

		// 3. Sản phẩm mới: Tuyệt đối KHÔNG TRÙNG với Flash Sale VÀ Nổi Bật!
		const newCandidates = products.filter(
			(p: any) => !flashSaleIds.has(p.id) && !featuredIds.has(p.id) && p.isNew
		);
		const newPool = newCandidates.length >= 8
			? newCandidates
			: products.filter((p: any) => !flashSaleIds.has(p.id) && !featuredIds.has(p.id));
		const arrivals = seededShuffle(newPool, todaySeed + 202).slice(0, 8);

		return {
			flashSaleProducts: flashSale,
			featuredProducts: featured,
			newArrivals: arrivals,
		};
	}, [products]);

	return (
		<View style={styles.page}>
			<Header />
			<ScrollView style={styles.container} contentContainerStyle={[styles.content, !isDesktop && styles.contentMobile]}>
				{selectedCategories.length > 0 ? (
					<View style={styles.filteredSection}>
						<View style={[styles.filteredHeader, !isDesktop && styles.filteredHeaderMobile]}>
							<View style={{ flex: 1 }}>
								<View style={styles.filteredBadge}>
									<Ionicons name="grid" size={13} color="#2563eb" style={{ marginRight: 5 }} />
									<Text style={styles.filteredBadgeText}>DANH MỤC SẢN PHẨM</Text>
								</View>
								<Text style={[styles.filteredTitle, !isDesktop && styles.filteredTitleMobile]}>
									{selectedCategories.length === 1
										? (GEAR_CATEGORIES.find((c) => normalizeCategory(c.id) === normalizeCategory(selectedCategories[0]))?.label || selectedCategories[0])
										: `Đang chọn ${selectedCategories.length} danh mục`}
								</Text>
								<Text style={styles.filteredSubtitle}>
									Tìm thấy {filteredProducts.length} sản phẩm phù hợp
								</Text>
							</View>

							<Pressable
								style={styles.clearFilterBtn}
								onPress={clearCategoryFilter}
								accessibilityLabel="Xóa bộ lọc danh mục"
							>
								<Ionicons name="close-circle" size={16} color="#2563eb" style={{ marginRight: 6 }} />
								<Text style={styles.clearFilterBtnText}>Xóa bộ lọc (Về trang chủ)</Text>
							</Pressable>
						</View>

						{/* ACTIVE CHIPS ROW */}
						<View style={styles.activeChipsRow}>
							{selectedCategories.map((catId) => {
								const catObj = GEAR_CATEGORIES.find((c) => normalizeCategory(c.id) === normalizeCategory(catId));
								return (
									<View key={catId} style={styles.activeChip}>
										<Text style={styles.activeChipText}>{catObj?.label || catId}</Text>
										<Pressable onPress={() => toggleCategoryFilter(catId)} hitSlop={6}>
											<Ionicons name="close" size={14} color="#2563eb" style={{ marginLeft: 6 }} />
										</Pressable>
									</View>
								);
							})}
						</View>

						{/* PRODUCTS GRID */}
						{filteredProducts.length > 0 ? (
							<View style={styles.gridList}>
								{filteredProducts.map((product) => (
									<View key={product.id} style={isDesktop ? styles.gridItemDesktop : styles.gridItemMobile}>
										<ProductCard product={product} />
									</View>
								))}
							</View>
						) : (
							<View style={styles.emptyFilteredState}>
								<Ionicons name="search-outline" size={60} color="#94a3b8" />
								<Text style={styles.emptyFilteredTitle}>Không có sản phẩm nào</Text>
								<Text style={styles.emptyFilteredSub}>
									Không tìm thấy sản phẩm nào trong danh mục đã chọn.
								</Text>
								<Pressable style={styles.emptyResetBtn} onPress={clearCategoryFilter}>
									<Text style={styles.emptyResetBtnText}>Quay lại trang chủ</Text>
								</Pressable>
							</View>
						)}
					</View>
				) : (
					<>
						{/* GEARVN STYLE EVENT SHOWCASE BANNERS */}
						<HomeHeroBanners />

						{/* Campaign shortcuts */}
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={[styles.promoStrip, !isDesktop && styles.promoStripMobile]}
						>
							{HOME_PROMOS.map((promo) => (
								<Pressable
									key={promo.title}
									onPress={() => router.push('/products' as any)}
									style={[styles.promoItem, isDesktop && styles.promoItemDesktop, !isDesktop && styles.promoItemMobile]}
								>
									<View style={[styles.promoIcon, { backgroundColor: `${promo.color}18` }]}>
										<Ionicons name={promo.icon as any} size={22} color={promo.color} />
									</View>
									<View style={styles.promoCopy}>
										<Text style={styles.promoTitle} numberOfLines={1}>{promo.title}</Text>
										<Text style={styles.promoDetail} numberOfLines={1}>{promo.detail}</Text>
									</View>
									<Ionicons name="arrow-forward" size={16} color="#64748b" />
								</Pressable>
							))}
						</ScrollView>

						<View style={[styles.serviceStrip, !isDesktop && styles.serviceStripMobile]}>
							{SERVICE_PROMISES.map((item) => (
								<View key={item.title} style={[styles.serviceItem, !isDesktop && styles.serviceItemMobile]}>
									<Ionicons name={item.icon as any} size={19} color="#2563eb" />
									<View style={styles.serviceCopy}>
										<Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
										<Text style={styles.serviceDetail} numberOfLines={1}>{item.detail}</Text>
									</View>
								</View>
							))}
						</View>

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
						<View style={[styles.dealBanner, isDark && styles.dealBannerDark, !isDesktop && styles.dealBannerMobile]}>
							<View style={!isDesktop && { flex: 1 }}>
								<Text style={[styles.dealEyebrow, isDark && styles.dealEyebrowDark]}>DANGVINHPC DEALS</Text>
								<Text style={[styles.dealTitle, isDark && styles.dealTitleDark, !isDesktop && styles.dealTitleMobile]}>Nâng cấp setup của bạn</Text>
								<Text style={[styles.dealSubtitle, isDark && styles.dealSubtitleDark, !isDesktop && styles.dealSubtitleMobile]}>Tiết kiệm lên đến 30% cho các sản phẩm đã chọn.</Text>
							</View>
							<Link href={'/products' as any} style={StyleSheet.flatten([styles.dealButton, !isDesktop && styles.dealButtonMobile])}>
								<Text style={styles.dealButtonText}>MUA DEAL</Text>
							</Link>
						</View>
					</>
				)}

				{/* Footer */}
				<Footer />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	container: {
		flex: 1,
	},
	content: {
		paddingHorizontal: 20,
		paddingVertical: 16,
		maxWidth: 1280,
		width: '100%',
		alignSelf: 'center',
	},
	contentMobile: {
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	promoStrip: {
		flexDirection: 'row',
		gap: 12,
		paddingBottom: 4,
	},
	promoStripMobile: {
		paddingHorizontal: 4,
	},
	promoItem: {
		minWidth: 220,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 11,
		paddingHorizontal: 14,
		paddingVertical: 14,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 8,
	},
	promoItemMobile: {
		minWidth: 236,
	},
	promoItemDesktop: {
		flex: 1,
		minWidth: 0,
	},
	promoIcon: {
		width: 40,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	promoCopy: {
		flex: 1,
		minWidth: 0,
	},
	promoTitle: {
		color: '#0f172a',
		fontSize: 13,
		fontWeight: '800',
	},
	dealTitleDark: {
		color: '#ffffff',
	},
	promoDetail: {
		color: '#64748b',
		fontSize: 11,
		marginTop: 3,
	},
	serviceStrip: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		rowGap: 12,
		paddingVertical: 18,
		marginTop: 12,
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#dbe2ea',
	},
	serviceStripMobile: {
		paddingVertical: 14,
		rowGap: 14,
	},
	serviceItem: {
		width: '24%',
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	serviceItemMobile: {
		width: '48%',
	},
	serviceCopy: {
		flex: 1,
		minWidth: 0,
	},
	serviceTitle: {
		color: '#1e293b',
		fontSize: 11,
		fontWeight: '800',
	},
	serviceDetail: {
		color: '#64748b',
		fontSize: 10,
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
		backgroundColor: '#e2e8f0',
		borderRadius: 8,
		paddingHorizontal: 7,
		paddingVertical: 3,
		minWidth: 28,
		alignItems: 'center',
	},
	dealBannerDark: {
		backgroundColor: '#0f172a',
		borderColor: '#263449',
	},
	countdownNum: {
		color: '#0f172a',
		fontWeight: '800',
		fontSize: 13,
	},
	countdownBoxDark: {
		backgroundColor: '#0f172a',
	},
	countdownNumDark: {
		color: '#ffffff',
	},
	countdownSep: {
		color: '#475569',
		fontWeight: '800',
		fontSize: 14,
	},
	countdownSepDark: {
		color: '#cbd5e1',
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
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#e2e8f0',
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
		color: '#2563eb',
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 1,
	},
	dealEyebrowDark: {
		color: '#60a5fa',
	},
	dealTitle: {
		marginTop: 8,
		color: '#0f172a',
		fontSize: 26,
		fontWeight: '800',
	},
	dealTitleMobile: {
		fontSize: 18,
		marginTop: 4,
	},
	dealSubtitle: {
		marginTop: 8,
		color: '#475569',
		fontSize: 14,
	},
	dealSubtitleDark: {
		color: '#94a3b8',
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
	filteredSection: {
		marginBottom: 40,
	},
	filteredHeader: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 16,
		shadowColor: '#000',
		shadowOpacity: 0.04,
		shadowRadius: 10,
		elevation: 2,
	},
	filteredHeaderMobile: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		padding: 16,
		gap: 12,
	},
	filteredBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#eff6ff',
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 6,
		alignSelf: 'flex-start',
		marginBottom: 6,
	},
	filteredBadgeText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#2563eb',
		letterSpacing: 0.5,
	},
	filteredTitle: {
		fontSize: 22,
		fontWeight: '800',
		color: '#0f172a',
		letterSpacing: -0.3,
	},
	filteredTitleMobile: {
		fontSize: 18,
	},
	filteredSubtitle: {
		fontSize: 13,
		color: '#64748b',
		marginTop: 3,
	},
	clearFilterBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#eff6ff',
		borderWidth: 1,
		borderColor: '#bfdbfe',
		paddingHorizontal: 14,
		paddingVertical: 9,
		borderRadius: 10,
	},
	clearFilterBtnText: {
		color: '#2563eb',
		fontSize: 13,
		fontWeight: '700',
	},
	activeChipsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginBottom: 20,
	},
	activeChip: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#eff6ff',
		borderWidth: 1,
		borderColor: '#bfdbfe',
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
	},
	activeChipText: {
		fontSize: 13,
		fontWeight: '600',
		color: '#2563eb',
	},
	emptyFilteredState: {
		backgroundColor: '#ffffff',
		borderRadius: 16,
		padding: 40,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		marginTop: 10,
	},
	emptyFilteredTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#0f172a',
		marginTop: 14,
	},
	emptyFilteredSub: {
		fontSize: 14,
		color: '#64748b',
		marginTop: 6,
		textAlign: 'center',
		maxWidth: 400,
	},
	emptyResetBtn: {
		marginTop: 18,
		backgroundColor: '#2563eb',
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
	},
	emptyResetBtnText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 14,
	},
});
