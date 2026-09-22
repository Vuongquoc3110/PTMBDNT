const mysql = require('mysql2/promise');
const fs = require('fs');

async function exportProducts() {
  const c = await mysql.createConnection({
    host: 'localhost', user: 'root', database: 'promart'
  });
  const [products] = await c.query('SELECT * FROM products');
  const [categories] = await c.query('SELECT * FROM categories');
  c.end();

  const formattedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category_id,
    category_id: p.category_id,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
    discount: p.discount || undefined,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    stock: p.stock,
    isFeatured: Boolean(p.isFeatured),
    isNew: Boolean(p.isNew),
    isSale: Boolean(p.isSale),
    isHot: Boolean(p.isHot),
    image: p.image,
    images: [p.image],
    description: p.description,
    features: p.features ? (typeof p.features === 'string' ? JSON.parse(p.features) : p.features) : [],
    specifications: p.specifications ? (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications) : {}
  }));

  const content = `export type Product = {
  id: string;
  name: string;
  category: string;
  category_id?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  isHot?: boolean;
  image: string;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  configurations?: {
    cpu?: string[];
    ram?: string[];
    storage?: string[];
    gpu?: string[];
  };
};

export const formatPrice = (value: number) => \`\${value.toLocaleString('vi-VN')} ₫\`;

export const categories = ${JSON.stringify(categories, null, 2)};

export const products: Product[] = ${JSON.stringify(formattedProducts, null, 2)};

export const featuredProducts = products.filter((p) => p.isFeatured || p.isHot || p.isSale);
export const flashSaleProducts = products.filter((p) => p.isSale);
export const newArrivals = products.filter((p) => p.isNew);
`;

  fs.writeFileSync('data/products.ts', content, 'utf8');
  console.log('✅ Synchronized data/products.ts with', products.length, 'products');
}
exportProducts();
