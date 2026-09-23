require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mysql = require('mysql2/promise');

const path = 'C:/Users/Admin/.gemini/antigravity-ide/brain/12ddfc0b-7e09-4aee-9a13-9c8aabd7400e/.system_generated/steps/25/content.md';
const content = fs.readFileSync(path, 'utf8');

const matches = [...content.matchAll(/<div class="box-image"[\s\S]*?<div class="box-text[\s\S]*?<\/div>\s*<\/div>/gi)];

const rawItems = [];
const seen = new Set();

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
      .replace(/&#8220;/g, '"')
      .replace(/&#215;/g, 'x')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (seen.has(title)) continue;
    seen.add(title);

    const img = imgM ? imgM[1] : '';
    let priceStr = priceM ? priceM[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').replace(/&#8363;/g, '').replace(/[^\d]/g, '').trim() : '';
    let price = priceStr ? parseInt(priceStr, 10) : 0;
    
    rawItems.push({ title, img, price });
  }
}

console.log(`Extracted ${rawItems.length} items from laptop360.net.`);

// Fallback pricing map for items with "Chưa có giá" or contact
function estimatePrice(title) {
  const t = title.toLowerCase();
  if (t.includes('sạc laptop') || t.includes('adapter')) return 199000;
  if (t.includes('macbook air 2025') || t.includes('m4')) return 27990000;
  if (t.includes('macbook air 2022') || t.includes('m2')) return 18490000;
  if (t.includes('legion r9000p 2025')) return 35990000;
  if (t.includes('legion r9000p 2023')) return 23990000;
  if (t.includes('predator helios neo 16 2024')) return 33500000;
  if (t.includes('rog zephyrus g14 2024')) return 34990000;
  if (t.includes('rog strix g16 2025')) return 38990000;
  if (t.includes('nitro 5 tiger')) return 16990000;
  if (t.includes('ideapad slim 3 14se')) return 14500000;
  if (t.includes('vostro 5502')) return 11200000;
  if (t.includes('latitude 7280')) return 4800000;
  if (t.includes('precision 7530')) return 9800000;
  if (t.includes('precision 7560')) return 22500000;
  if (t.includes('inspiron 15 3511')) return 10500000;
  return 15000000;
}

// Generate rich specs & details
function buildProductData(item, index) {
  const isAccessory = item.title.toLowerCase().includes('sạc laptop') || item.title.toLowerCase().includes('adapter');
  const category_id = isAccessory ? 'accessories' : 'laptop';
  const finalPrice = item.price > 0 ? item.price : estimatePrice(item.title);
  
  // discount 5-15%
  const discountRate = (index % 4 === 0) ? 12 : (index % 3 === 0) ? 8 : (index % 2 === 0) ? 5 : 10;
  const oldPrice = Math.round((finalPrice * (1 + discountRate / 100)) / 10000) * 10000;
  
  const id = `l360-${String(index + 1).padStart(3, '0')}`;
  
  // Parse specs from title
  const specs = {};
  const t = item.title;
  
  if (isAccessory) {
    specs['Loại phụ kiện'] = 'Củ sạc laptop chính hãng';
    specs['Công suất'] = t.includes('65W') ? '65W' : 'Chuẩn zin hãng';
    specs['Điện áp'] = t.includes('19.5V') ? '19.5V - 3.9A' : t.includes('19V') ? '19V - 3.33A' : 'Tự điều chỉnh (PD)';
    specs['Chuẩn cắm'] = t.includes('Type-C') ? 'USB Type-C Power Delivery' : t.includes('Chân Tròn To') ? 'Chân tròn 7.4x5.0mm' : 'Chân kim chuyên dụng';
    specs['Bảo hành'] = '12 tháng 1 đổi 1 tại Laptop360';
  } else {
    // CPU
    if (t.includes('M4')) specs['CPU'] = 'Apple M4 chip (10-core)';
    else if (t.includes('M2')) specs['CPU'] = 'Apple M2 chip (8-core)';
    else if (t.includes('i9-14900HX') || t.includes('i9 14900HX')) specs['CPU'] = 'Intel Core i9-14900HX (24C/32T)';
    else if (t.includes('i7 1355U') || t.includes('i7-1355U')) specs['CPU'] = 'Intel Core i7-1355U (10 nhân 12 luồng)';
    else if (t.includes('i7-13620H') || t.includes('i7 13620H')) specs['CPU'] = 'Intel Core i7-13620H (10 cores, up to 4.9GHz)';
    else if (t.includes('i7-1260P') || t.includes('i7 1260P')) specs['CPU'] = 'Intel Core i7-1260P (12 cores, 16 threads)';
    else if (t.includes('i7 1255U') || t.includes('i7-1255U')) specs['CPU'] = 'Intel Core i7-1255U (10 cores, up to 4.7GHz)';
    else if (t.includes('i7-11800H') || t.includes('i7 11800H')) specs['CPU'] = 'Intel Core i7-11800H (8 nhân 16 luồng)';
    else if (t.includes('i5-13420H') || t.includes('i5 13420H')) specs['CPU'] = 'Intel Core i5-13420H (8 nhân, 12 luồng)';
    else if (t.includes('i5-12450H')) specs['CPU'] = 'Intel Core i5-12450H (8 nhân 12 luồng)';
    else if (t.includes('i5-1240P')) specs['CPU'] = 'Intel Core i5-1240P (12 nhân 16 luồng)';
    else if (t.includes('Ryzen 9 8945HX')) specs['CPU'] = 'AMD Ryzen 9 8945HX AI High Performance';
    else if (t.includes('Ryzen 9-9955HX')) specs['CPU'] = 'AMD Ryzen 9-9955HX Thế hệ mới';
    else if (t.includes('R9 8945HS')) specs['CPU'] = 'AMD Ryzen 9 8945HS với AMD Ryzen AI';
    else if (t.includes('Ryzen 7 8745HS')) specs['CPU'] = 'AMD Ryzen 7 8745HS (8C/16T)';
    else if (t.includes('Ryzen 5 7530U')) specs['CPU'] = 'AMD Ryzen 5 7530U (6C/12T, up to 4.5GHz)';
    else if (t.includes('i5-1135G7') || t.includes('i5 - 1135G7')) specs['CPU'] = 'Intel Core i5-1135G7 Iris Xe';
    else if (t.includes('i5-10310U')) specs['CPU'] = 'Intel Core i5-10310U vPro';
    else if (t.includes('i5-8365U') || t.includes('i5 - 8365U')) specs['CPU'] = 'Intel Core i5-8365U 4 nhân 8 luồng';
    else if (t.includes('i5-8350U') || t.includes('i5 - 8350U')) specs['CPU'] = 'Intel Core i5-8350U vPro';
    else if (t.includes('i5 - 7300U') || t.includes('i5-7300U')) specs['CPU'] = 'Intel Core i5-7300U';
    else if (t.includes('i5 - 6300U') || t.includes('i5-6300U') || t.includes('i5-6200U')) specs['CPU'] = 'Intel Core i5 Gen 6th';
    else specs['CPU'] = 'Intel Core / AMD Ryzen thế hệ tối ưu';

    // RAM
    if (t.includes('32GB') || t.includes('32 GB')) specs['RAM'] = '32GB DDR4/DDR5 Dual Channel';
    else if (t.includes('16GB') || t.includes('16 GB') || t.includes('Ram 16GB') || t.includes('16Gb')) specs['RAM'] = '16GB DDR4/DDR5 High Speed';
    else specs['RAM'] = '8GB DDR4 (Hỗ trợ nâng cấp 16GB/32GB)';

    // Storage
    if (t.includes('1TB') || t.includes('1 TB')) specs['Ổ cứng'] = '1TB NVMe PCIe M.2 SSD';
    else if (t.includes('512GB') || t.includes('512 GB')) specs['Ổ cứng'] = '512GB NVMe PCIe SSD';
    else specs['Ổ cứng'] = '256GB NVMe M.2 SSD tốc độ cao';

    // GPU
    if (t.includes('RTX 5060')) specs['Card đồ họa'] = 'NVIDIA GeForce RTX 5060 8GB GDDR6';
    else if (t.includes('RTX 4060')) specs['Card đồ họa'] = 'NVIDIA GeForce RTX 4060 8GB GDDR6';
    else if (t.includes('RTX 4050')) specs['Card đồ họa'] = 'NVIDIA GeForce RTX 4050 6GB GDDR6';
    else if (t.includes('RTX 3050')) specs['Card đồ họa'] = 'NVIDIA GeForce RTX 3050 4GB/6GB';
    else if (t.includes('RTX2050') || t.includes('RTX 2050')) specs['Card đồ họa'] = 'NVIDIA GeForce RTX 2050 4GB GDDR6';
    else if (t.includes('Quadro T1200')) specs['Card đồ họa'] = 'NVIDIA Quadro T1200 4GB GDDR6 Chuyên Đồ Họa';
    else if (t.includes('Quadro T1000')) specs['Card đồ họa'] = 'NVIDIA Quadro T1000 4GB GDDR5';
    else if (t.includes('MX570A')) specs['Card đồ họa'] = 'NVIDIA GeForce MX570A 2GB GDDR6';
    else if (t.includes('GTX 960M')) specs['Card đồ họa'] = 'NVIDIA GeForce GTX 960M 2GB';
    else if (t.includes('M4') || t.includes('M2')) specs['Card đồ họa'] = 'Apple Integrated GPU';
    else specs['Card đồ họa'] = 'Intel Iris Xe / AMD Radeon Graphics';

    // Display
    if (t.includes('16" 2K+') || t.includes('16″ 2.5K') || t.includes('2.5K 240Hz')) specs['Màn hình'] = '16 inch 2.5K (2560x1600) 240Hz 100% sRGB';
    else if (t.includes('2.8K OLED') || t.includes('OLED')) specs['Màn hình'] = '14 inch 2.8K OLED 120Hz 100% DCI-P3';
    else if (t.includes('3K')) specs['Màn hình'] = '16 inch 3K (3072x1920) IPS viền siêu mỏng';
    else if (t.includes('4K')) specs['Màn hình'] = '14.0 inch 4K UHD (3840x2160) sắc nét';
    else if (t.includes('Touch') || t.includes('x360') || t.includes('2-in-1') || t.includes('Surface')) specs['Màn hình'] = 'Cảm ứng đa điểm, xoay gập 360 độ hoặc tách rời';
    else if (t.includes('15.6')) specs['Màn hình'] = '15.6 inch Full HD (1920x1080) Anti-glare';
    else if (t.includes('16"')) specs['Màn hình'] = '16.0 inch FHD+/2K+ viền siêu mỏng tỉ lệ 16:10';
    else specs['Màn hình'] = '14.0 inch Full HD IPS chống chói góc rộng';

    specs['Trọng lượng'] = t.includes('Air') || t.includes('Nano') ? '0.9kg - 1.2kg' : t.includes('Precision') || t.includes('Legion') ? '2.2kg - 2.5kg' : '1.3kg - 1.7kg';
    specs['Tình trạng'] = t.includes('New 100%') || t.includes('Mới 100%') ? 'Mới 100% Fullbox nguyên seal' : 'Lướt 99% Zin nguyên bản 100%';
    specs['Bảo hành'] = '12 tháng tại Laptop360 - 1 đổi 1 trong 30 ngày';
  }

  const features = isAccessory ? [
    'Chân cắm chắc chắn, an toàn chống cháy nổ và quá dòng',
    'Tương thích hoàn hảo với các dòng máy tính xách tay',
    'Bảo hành đổi mới 12 tháng tại Laptop360 Hải Phòng'
  ] : [
    'Cam kết 100% máy nguyên bản chưa qua sửa chữa',
    'Pin dung lượng cao, hoạt động ổn định và bền bỉ',
    'Bàn phím gõ êm, khung viền hoàn thiện tỉ mỉ và sang trọng',
    'Tặng gói quà tặng: Balo thời trang + Chuột cao cấp + Lót chuột',
    'Bảo hành 12 tháng, hỗ trợ cài đặt phần mềm và vệ sinh trọn đời'
  ];

  const description = isAccessory
    ? `Sản phẩm phụ kiện chính hãng cung cấp bởi hệ thống Laptop360 Hải Phòng. Nguồn điện ổn định, sạc nhanh và an toàn tuyệt đối cho linh kiện máy tính.`
    : `Sản phẩm ${item.title} được tuyển chọn kỹ lưỡng theo tiêu chuẩn của Laptop360: Pin không chai, số lần sạc ít, ngoại hình đẹp keng 99% đến mới 100%. Đáp ứng hoàn hảo mọi nhu cầu học tập, làm việc văn phòng, thiết kế đồ họa chuyên sâu và giải trí đỉnh cao.`;

  return {
    id,
    name: item.title,
    category_id,
    price: finalPrice,
    oldPrice,
    discount: discountRate,
    rating: parseFloat((4.7 + (index % 4) * 0.1).toFixed(1)),
    reviewCount: 15 + ((index * 7) % 110),
    stock: 5 + ((index * 3) % 25),
    isFeatured: (index % 5 === 0) ? 1 : 0,
    isNew: (index % 3 === 0 || item.title.includes('New') || item.title.includes('Mới') || item.title.includes('2025') || item.title.includes('2026')) ? 1 : 0,
    isSale: (index % 2 === 0) ? 1 : 0,
    isHot: (index % 4 === 0 || item.title.includes('XPS') || item.title.includes('MacBook') || item.title.includes('Legion') || item.title.includes('Zephyrus')) ? 1 : 0,
    image: item.img,
    description,
    specifications: specs,
    features
  };
}

const productsToInsert = rawItems.map((item, idx) => buildProductData(item, idx));

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh'
  });

  console.log('Connected to MySQL. Inserting/Updating products from Laptop360...');

  let insertedCount = 0;
  for (const p of productsToInsert) {
    const query = `
      INSERT INTO products (
        id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,
        isFeatured, isNew, isSale, isHot, image, description, specifications, features
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        price = VALUES(price),
        oldPrice = VALUES(oldPrice),
        discount = VALUES(discount),
        rating = VALUES(rating),
        reviewCount = VALUES(reviewCount),
        stock = VALUES(stock),
        isFeatured = VALUES(isFeatured),
        isNew = VALUES(isNew),
        isSale = VALUES(isSale),
        isHot = VALUES(isHot),
        image = VALUES(image),
        description = VALUES(description),
        specifications = VALUES(specifications),
        features = VALUES(features)
    `;

    await connection.execute(query, [
      p.id,
      p.name,
      p.category_id,
      p.price,
      p.oldPrice,
      p.discount,
      p.rating,
      p.reviewCount,
      p.stock,
      p.isFeatured,
      p.isNew,
      p.isSale,
      p.isHot,
      p.image,
      p.description,
      JSON.stringify(p.specifications),
      JSON.stringify(p.features)
    ]);
    insertedCount++;
  }

  // Update categories count
  const [catRows] = await connection.query(`
    SELECT category_id, COUNT(*) as cnt FROM products GROUP BY category_id
  `);

  for (const r of catRows) {
    await connection.execute(
      `UPDATE categories SET count = ? WHERE id = ?`,
      [r.cnt, r.category_id]
    );
  }

  const [totalProducts] = await connection.query('SELECT COUNT(*) as count FROM products');
  console.log(`✅ Successfully seeded ${insertedCount} products from Laptop360!`);
  console.log(`📊 Total products in database now: ${totalProducts[0].count}`);

  await connection.end();

  // Export as JSON for synchronization
  fs.writeFileSync('scripts/laptop360-products.json', JSON.stringify(productsToInsert, null, 2), 'utf8');
  console.log('Saved scripts/laptop360-products.json');
}

main().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
