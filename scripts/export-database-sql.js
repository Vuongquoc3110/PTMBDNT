require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const mysql = require('mysql2/promise');

async function exportSql() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh'
  });

  const [products] = await connection.query("SELECT * FROM products WHERE id LIKE 'l360-%' ORDER BY id ASC");
  await connection.end();

  let sql = `\n-- ============================================\n-- Laptop360 Products (80 sản phẩm đa dạng từ laptop360.net)\n-- ============================================\nINSERT INTO products (\n  id, name, category_id, price, oldPrice, discount, rating, reviewCount, stock,\n  isFeatured, isNew, isSale, isHot, image, description, specifications, features\n) VALUES\n`;

  const rows = products.map(p => {
    const esc = (str) => (str ? str.replace(/'/g, "''").replace(/\\/g, '\\\\') : '');
    const specs = typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications || {});
    const feats = typeof p.features === 'string' ? p.features : JSON.stringify(p.features || []);

    return `('${esc(p.id)}', '${esc(p.name)}', '${esc(p.category_id)}', ${p.price}, ${p.oldPrice || 'NULL'}, ${p.discount || 0}, ${p.rating}, ${p.reviewCount}, ${p.stock}, ${p.isFeatured ? 1 : 0}, ${p.isNew ? 1 : 0}, ${p.isSale ? 1 : 0}, ${p.isHot ? 1 : 0}, '${esc(p.image)}', '${esc(p.description)}', '${esc(specs)}', '${esc(feats)}')`;
  });

  sql += rows.join(',\n') + '\nON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image=VALUES(image);\n';

  fs.writeFileSync('server/seed-laptop360.sql', sql, 'utf8');
  console.log(`✅ Exported ${products.length} SQL insert statements to server/seed-laptop360.sql`);
}

exportSql().catch(console.error);
