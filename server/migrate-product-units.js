require('dotenv').config({ path: '.env.local', quiet: true });
const mysql = require('mysql2/promise');
const fs = require('node:fs');
const path = require('node:path');
const { initializeUnits } = require('./product-units');

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root', password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'maytinh', charset: 'utf8mb4',
  });
  try {
    const [orders] = await pool.query('SELECT id, items, updatedAt FROM orders');
    const folder = path.join(__dirname, 'backups');
    fs.mkdirSync(folder, { recursive: true });
    const backup = path.join(folder, `orders-before-unit-codes-${Date.now()}.json`);
    fs.writeFileSync(backup, JSON.stringify(orders, null, 2));
    await initializeUnits(pool);
    const [counts] = await pool.query('SELECT status, COUNT(*) AS total FROM product_units GROUP BY status');
    console.log(JSON.stringify({ backup, counts }));
  } finally { await pool.end(); }
}
migrate().catch(error => { console.error(error.message); process.exitCode = 1; });
