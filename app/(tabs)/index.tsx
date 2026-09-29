import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
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

const HOME_CAMPAIGNS = [
	{
		eyebrow: 'BUILD PC GAMING',
		title: 'Sẵn sàng chiến game,\ntối ưu từng đồng.',
		subtitle: 'Chọn cấu hình phù hợp, nhận tư vấn lắp đặt miễn phí.',
		badge: 'ƯU ĐÃI BUILD PC',
		image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=85',
	},
	{
		eyebrow: 'LAPTOP GAMING',
		title: 'Hiệu năng mạnh\ncho mọi cuộc chơi.',
		subtitle: 'Khám phá laptop gaming chính hãng, sẵn sàng giao nhanh.',
		badge: 'LAPTOP CHÍNH HÃNG',
		image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1000&q=85',
	},
	{
		eyebrow: 'GÓC SETUP',
		title: 'Nâng cấp góc máy,\nbật mood sáng tạo.',
		subtitle: 'Màn hình, bàn phím và phụ kiện cho góc làm việc của bạn.',
		badge: 'GỢI Ý SETUP',
		image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=85',
	},
];

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

export default function HomeScreen() {
	const { width } = useWindowDimensions();
	const isDesktop = width >= 768;
	const router = useRouter();
	const [activeCampaign, setActiveCampaign] = useState(0);

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

	useEffect(() => {
		const timer = setInterval(() => {
			setActiveCampaign((current) => (current + 1) % HOME_CAMPAIGNS.length);
		}, 6500);
		return () => clearInterval(timer);
	}, []);

	const campaign = HOME_CAMPAIGNS[activeCampaign];

	return (
		<View style={styles.page}>
			<Header />
			<ScrollView style={styles.container} contentContainerStyle={[styles.content, !isDesktop && styles.contentMobile]}>
				{/* Campaign carousel */}
				<Animated.View style={[styles.heroCard, !isDesktop && styles.heroCardMobile, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
					<View style={[styles.heroTextWrap, !isDesktop && styles.heroTextWrapMobile]}>
						<Text style={styles.eyebrow}>{campaign.eyebrow}</Text>
						<Text style={[styles.heroTitle, !isDesktop && styles.heroTitleMobile]}>{campaign.title}</Text>
						<Text style={[styles.heroSubtitle, !isDesktop && styles.heroSubtitleMobile]}>{campaign.subtitle}</Text>
						<View style={[styles.heroActions, !isDesktop && styles.heroActionsMobile]}>
							<Link href={'/products' as any} style={StyleSheet.flatten([styles.primaryBtn, !isDesktop && styles.btnMobile])}>
								<Text style={styles.primaryBtnText}>KHÁM PHÁ NGAY</Text>
							</Link>
							<Link href={'/products' as any} style={StyleSheet.flatten([styles.secondaryBtn, !isDesktop && styles.btnMobile])}>
								<Text style={styles.secondaryBtnText}>XEM SẢN PHẨM</Text>
							</Link>
						</View>
					</View>
					<View style={[styles.heroVisual, !isDesktop && styles.heroVisualMobile]}>
						<Image
							source={{ uri: campaign.image }}
							style={styles.heroImage}
						/>
						<View style={styles.heroBadge}>
							<Text style={styles.heroBadgeText}>{campaign.badge}</Text>
							<Text style={styles.heroBadgeSub}>DANGVINHPC</Text>
						</View>
					</View>
				</Animated.View>
				<View style={[styles.carouselControls, !isDesktop && styles.carouselControlsMobile]}>
					<View style={styles.carouselDots}>
						{HOME_CAMPAIGNS.map((item, index) => (
							<Pressable
								key={item.eyebrow}
								accessibilityRole="button"
								accessibilityLabel={`Xem chiến dịch ${index + 1}: ${item.eyebrow}`}
								onPress={() => setActiveCampaign(index)}
								style={[styles.carouselDot, activeCampaign === index && styles.carouselDotActive]}
							/>
						))}
					</View>
					<Text style={styles.carouselCount}>{String(activeCampaign + 1).padStart(2, '0')} / {String(HOME_CAMPAIGNS.length).padStart(2, '0')}</Text>
				</View>

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
		backgroundColor: '#111827',
		borderRadius: 12,
		padding: 28,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 0,
		overflow: 'hidden',
	},
	heroCardMobile: {
		flexDirection: 'column',
		padding: 18,
		borderRadius: 10,
	},
	heroTextWrap: {
		flex: 1,
		paddingRight: 24,
	},
	heroTextWrapMobile: {
		paddingRight: 0,
		width: '100%',
	},
	eyebrow: {
		color: '#fb923c',
		fontSize: 12,
		fontWeight: '800',
		letterSpacing: 0,
	},
	heroTitle: {
		marginTop: 12,
		color: '#ffffff',
		fontSize: 34,
		fontWeight: '800',
		lineHeight: 42,
	},
	heroTitleMobile: {
		fontSize: 25,
		lineHeight: 31,
		marginTop: 8,
	},
	heroSubtitle: {
		marginTop: 12,
		color: '#cbd5e1',
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
		backgroundColor: '#f97316',
		borderRadius: 6,
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
		borderWidth: 1,
		borderColor: '#64748b',
		borderRadius: 6,
		paddingHorizontal: 20,
		paddingVertical: 12,
		textAlign: 'center',
	},
	secondaryBtnText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 13,
		textAlign: 'center',
	},
	heroVisual: {
		width: 360,
		height: 250,
		borderRadius: 8,
		overflow: 'hidden',
		position: 'relative',
	},
	heroVisualMobile: {
		width: '100%',
		height: 180,
		borderRadius: 6,
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
		backgroundColor: '#f97316',
		borderRadius: 4,
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
		color: '#fff7ed',
		fontSize: 11,
		marginTop: 2,
	},
	carouselControls: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 4,
		paddingTop: 10,
		marginBottom: 6,
	},
	carouselControlsMobile: {
		paddingHorizontal: 2,
	},
	carouselDots: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	carouselDot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: '#cbd5e1',
	},
	carouselDotActive: {
		width: 22,
		backgroundColor: '#f97316',
	},
	carouselCount: {
		color: '#64748b',
		fontSize: 11,
		fontWeight: '700',
	},
	promoStrip: {
		flexDirection: 'row',
		gap: 12,
		paddingBottom: 4,
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
