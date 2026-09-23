require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mysql = require('mysql2/promise');

async function sync() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh'
  });

  const [categories] = await connection.query('SELECT * FROM categories ORDER BY id ASC');
  const [products] = await connection.query('SELECT * FROM products ORDER BY createdAt DESC, id ASC');

  await connection.end();

  const formattedProducts = products.map(p => {
    let specs = p.specifications;
    if (typeof specs === 'string') {
      try { specs = JSON.parse(specs); } catch (e) { specs = {}; }
    }
    let features = p.features;
    if (typeof features === 'string') {
      try { features = JSON.parse(features); } catch (e) { features = []; }
    }

    return {
      id: p.id,
      name: p.name,
      category: p.category_id,
      category_id: p.category_id,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : undefined,
      discount: p.discount || 0,
      rating: Number(p.rating),
      reviewCount: p.reviewCount || 0,
      stock: p.stock || 0,
      isFeatured: Boolean(p.isFeatured),
      isNew: Boolean(p.isNew),
      isSale: Boolean(p.isSale),
      isHot: Boolean(p.isHot),
      image: p.image || '',
      images: [p.image || ''],
      description: p.description || '',
      features: features || [],
      specifications: specs || {}
    };
  });

  const fileContent = `export type Product = {
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

  fs.writeFileSync('data/products.ts', fileContent, 'utf8');
  console.log(`✅ Synchronized ${formattedProducts.length} products & ${categories.length} categories to data/products.ts!`);
}

sync().catch(err => {
  console.error('Sync error:', err);
  process.exit(1);
});
