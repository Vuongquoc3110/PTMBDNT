import { Link } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useCategories, useProducts } from '@/hooks/useApi';

export default function HomeScreen() {
	const { products, loading: productsLoading } = useProducts();
	const { categories, loading: categoriesLoading } = useCategories();

	// Mock data for flash sale and featured
	const flashSaleProducts = products.filter((p: any) => p.isSale)?.slice(0, 5) || [];
	const featuredProducts = products.filter((p: any) => p.isFeatured)?.slice(0, 5) || [];
	const newArrivals = products.filter((p: any) => p.isNew)?.slice(0, 5) || [];

	const isLoading = productsLoading || categoriesLoading;

	return (
		<View style={styles.page}>
			<Header />
			<ScrollView style={styles.container} contentContainerStyle={styles.content}>
				<View style={styles.heroCard}>
					<View style={styles.heroTextWrap}>
						<Text style={styles.eyebrow}>NÂNG CẤP SETUP CỦA BẠN</Text>
						<Text style={styles.heroTitle}>Máy tính mạnh mẽ cho công việc, gaming và sáng tạo.</Text>
						<Text style={styles.heroSubtitle}>Khám phá laptop và linh kiện máy tính hiệu năng cao, thiết kế hiện đại và bền bỉ.</Text>
						<View style={styles.heroActions}>
							<Link href={'/products' as any} style={styles.primaryBtn}>
								<Text style={styles.primaryBtnText}>MUA NGAY</Text>
							</Link>
							<Link href={'/products' as any} style={styles.secondaryBtn}>
								<Text style={styles.secondaryBtnText}>XEM KHUYẾN MÃI</Text>
							</Link>
						</View>
					</View>
					<View style={styles.heroVisual}>
						<Text style={styles.visualBadge}>DANGVINHPC</Text>
						<Text style={styles.visualLarge}>NEW</Text>
					</View>
				</View>

				{isLoading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#2563eb" />
						<Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
					</View>
				)}

				{!isLoading && categories.length > 0 && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Danh mục nổi bật</Text>
							<Link href={'/products' as any} style={styles.sectionLink}>Xem tất cả</Link>
						</View>

						<View style={styles.categoryRow}>
							{categories.slice(0, 8).map((cat: any, index: number) => (
								<Link key={cat.id} href={'/products' as any} style={StyleSheet.flatten([styles.categoryCard, { backgroundColor: ['#edf6ff', '#f5f3ff', '#effaf5', '#fff7ed', '#f8fafc', '#edf6ff', '#eff6ff'][index % 7] }])}>
									<Text style={styles.categoryIcon}>{cat.icon}</Text>
									<Text style={styles.categoryName}>{cat.name}</Text>
									<Text style={styles.categoryCount}>{cat.count} sản phẩm</Text>
								</Link>
							))}
						</View>
					</>
				)}

				{!isLoading && flashSaleProducts.length > 0 && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Flash Sale</Text>
							<Text style={styles.countdown}>05 : 32 : 18</Text>
						</View>

						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
							{flashSaleProducts.map((product: any) => (
								<ProductCard key={product.id} product={product} />
							))}
						</ScrollView>
					</>
				)}

				{!isLoading && featuredProducts.length > 0 && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
							<Link href={'/products' as any} style={styles.sectionLink}>Xem tất cả</Link>
						</View>

						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
							{featuredProducts.map((product: any) => (
								<ProductCard key={product.id} product={product} />
							))}
						</ScrollView>
					</>
				)}

				{!isLoading && newArrivals.length > 0 && (
					<>
						<View style={styles.sectionHeader}>
							<Text style={styles.sectionTitle}>Sản phẩm mới</Text>
							<Link href={'/products' as any} style={styles.sectionLink}>Xem tất cả</Link>
						</View>

						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
							{newArrivals.map((product: any) => (
								<ProductCard key={product.id} product={product} />
							))}
						</ScrollView>
					</>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	page: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
	},
	content: {
		paddingBottom: 40,
	},
	heroCard: {
		flexDirection: 'row',
		margin: 16,
		marginBottom: 24,
		paddingHorizontal: 20,
		paddingVertical: 32,
		backgroundColor: '#edf6ff',
		borderRadius: 24,
		borderWidth: 1,
		borderColor: '#dfeafc',
		alignItems: 'center',
		gap: 20,
	},
	heroTextWrap: {
		flex: 1,
		gap: 12,
	},
	heroVisual: {
		width: 160,
		height: 160,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 16,
		borderWidth: 2,
		borderColor: '#2563eb',
	},
	eyebrow: {
		color: '#2563eb',
		fontWeight: '700',
		fontSize: 12,
		letterSpacing: 1.2,
	},
	heroTitle: {
		color: '#0f172a',
		fontSize: 24,
		fontWeight: '800',
		lineHeight: 32,
	},
	heroSubtitle: {
		color: '#475569',
		fontSize: 13,
		lineHeight: 20,
	},
	heroActions: {
		flexDirection: 'row',
		gap: 8,
		marginTop: 8,
	},
	primaryBtn: {
		flex: 1,
		backgroundColor: '#2563eb',
		borderRadius: 8,
		paddingVertical: 10,
		alignItems: 'center',
	},
	primaryBtnText: {
		color: '#ffffff',
		fontWeight: '700',
		fontSize: 13,
	},
	secondaryBtn: {
		flex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingVertical: 10,
		alignItems: 'center',
	},
	secondaryBtnText: {
		color: '#0f172a',
		fontWeight: '700',
		fontSize: 13,
	},
	visualBadge: {
		position: 'absolute',
		top: 8,
		left: 8,
		color: '#2563eb',
		fontWeight: '800',
		fontSize: 10,
	},
	visualLarge: {
		color: '#2563eb',
		fontSize: 48,
		fontWeight: '900',
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		marginTop: 24,
		marginBottom: 16,
	},
	sectionTitle: {
		color: '#0f172a',
		fontSize: 18,
		fontWeight: '800',
	},
	sectionLink: {
		color: '#2563eb',
		fontWeight: '600',
		fontSize: 13,
	},
	countdown: {
		color: '#ef4444',
		fontWeight: '700',
		fontSize: 13,
	},
	categoryRow: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		gap: 8,
		marginBottom: 8,
		flexWrap: 'wrap',
	},
	categoryCard: {
		width: '48%',
		paddingVertical: 16,
		paddingHorizontal: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		alignItems: 'center',
		gap: 6,
	},
	categoryIcon: {
		fontSize: 24,
	},
	categoryName: {
		color: '#0f172a',
		fontWeight: '700',
		fontSize: 12,
		textAlign: 'center',
	},
	categoryCount: {
		color: '#64748b',
		fontSize: 11,
		textAlign: 'center',
	},
	horizontalList: {
		paddingHorizontal: 16,
		gap: 12,
		paddingBottom: 8,
	},
	loadingContainer: {
		paddingVertical: 40,
		alignItems: 'center',
		gap: 12,
	},
	loadingText: {
		color: '#64748b',
		fontSize: 14,
		fontWeight: '500',
	},
});
