require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mysql = require('mysql2/promise');

const path = 'C:/Users/Admin/.gemini/antigravity-ide/brain/12ddfc0b-7e09-4aee-9a13-9c8aabd7400e/.system_generated/steps/145/content.md';
const content = fs.readFileSync(path, 'utf8');
const matches = [...content.matchAll(/<div class="box-image"[\s\S]*?<div class="box-text[\s\S]*?<\/div>\s*<\/div>/gi)];

const dellItems = [];
for (const m of matches) {
  const block = m[0];
  const titleM = block.match(/<p class="name product-title[^"]*"><a[^>]*>([\s\S]*?)<\/a>/i);
  const imgM = block.match(/<img[^>]+(?:data-src|src)="([^"]+)"/i);
  const priceM = block.match(/<span class="woocommerce-Price-amount amount">([\s\S]*?)<\/span>/i);
  
  if (titleM) {
    let title = titleM[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&#8211;/g, '-')
      .replace(/&#8243;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#215;/g, 'x')
      .replace(/\s+/g, ' ')
      .trim();
    const img = imgM ? imgM[1] : '';
    let priceStr = priceM ? priceM[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').replace(/&#8363;/g, '').replace(/[^\d]/g, '').trim() : '';
    let price = priceStr ? parseInt(priceStr, 10) : 15000000;
    dellItems.push({ title, img, price });
  }
}

async function insertDell() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh'
  });

  console.log(`Inserting ${dellItems.length} Dell products from laptop360.net/laptop-dell/`);

  for (let i = 0; i < dellItems.length; i++) {
    const item = dellItems[i];
    const id = `l360-dell-${String(i + 1).padStart(3, '0')}`;
    const discount = (i % 3 === 0) ? 10 : 8;
    const oldPrice = Math.round((item.price * (1 + discount / 100)) / 10000) * 10000;
    
    const specs = {
      'Thương hiệu': 'Dell Chính Hãng',
      'Tình trạng': item.title.includes('Mới') ? 'Mới 100% Fullbox' : 'Like New 99% Zin nguyên bản',
      'Bảo hành': '12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày',
      'Màn hình': item.title.includes('2.5K') ? '14.0 inch 2.5K (2560x1600) 90Hz' : item.title.includes('15') ? '15.6 inch Full HD 120Hz' : '14.0 inch FHD+ IPS chống chói',
      'Tặng kèm': 'Balo chống sốc Laptop360 + Chuột không dây + Lót chuột'
    };

    if (item.title.includes('Alienware')) {
      specs['Dòng máy'] = 'Alienware Gaming cao cấp nhất';
      specs['Card đồ họa'] = 'NVIDIA GeForce RTX 3070Ti 8GB GDDR6';
      specs['CPU'] = 'AMD Ryzen 7 6800H / Intel Core i7 Gen 12th';
    } else if (item.title.includes('G15') || item.title.includes('G3')) {
      specs['Dòng máy'] = 'Dell Gaming Series chiến game mượt mà';
      specs['Card đồ họa'] = item.title.includes('RTX 3050') ? 'NVIDIA GeForce RTX 3050 6GB' : 'NVIDIA GTX 1650 4GB';
    } else {
      specs['Dòng máy'] = 'Dell Inspiron / Latitude Văn phòng - Học tập';
      specs['Card đồ họa'] = 'Intel Iris Xe Graphics / AMD Radeon Graphics';
    }

    const description = `Sản phẩm ${item.title} được nhập khẩu và phân phối bởi Laptop360 Hải Phòng. Ngoại hình tuyển chọn đẹp 99% đến mới 100%, nguyên zin 100% chưa qua sửa chữa, pin khỏe và hiệu năng ổn định.`;

    const features = [
      'Cam kết zin nguyên bản 100% từ nhà sản xuất',
      'Bảo hành toàn diện 12 tháng tại Laptop360',
      'Tặng gói phụ kiện: Balo + Chuột không dây + Cài win trọn đời',
      'Hỗ trợ trả góp lãi suất 0%'
    ];

    await conn.execute(`
      INSERT INTO products (
        id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
        isFeatured, isNew, isSale, isHot, image, description, specifications, features
      ) VALUES (?, ?, 'laptop', ?, ?, ?, 4.9, 35, 12, 1, 1, 1, 1, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image=VALUES(image)
    `, [
      id, item.title, item.price, oldPrice, discount,
      item.img, description, JSON.stringify(specs), JSON.stringify(features)
    ]);
  }

  await conn.execute("UPDATE categories SET count = (SELECT COUNT(*) FROM products WHERE category_id = 'laptop') WHERE id = 'laptop'");
  const [cat] = await conn.query("SELECT count FROM categories WHERE id = 'laptop'");
  console.log('Total Laptop count is now:', cat[0].count);

  await conn.end();
  require('child_process').execSync('node scripts/sync-products-to-data.js', { stdio: 'inherit' });
}

insertDell().catch(console.error);
