require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function fixEncoding() {
  console.log('🔄 Bắt đầu nạp lại toàn bộ dữ liệu tiếng Việt chuẩn UTF-8 (utf8mb4)...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
    charset: 'utf8mb4',
  });

  console.log('🗑️  Xóa và tạo mới database maytinh chuẩn utf8mb4_unicode_ci...');
  await connection.query('DROP DATABASE IF EXISTS maytinh;');
  await connection.query(`
    CREATE DATABASE maytinh
      CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
  await connection.query('USE maytinh;');
  await connection.query('SET NAMES utf8mb4;');

  const sqlFilePath = path.join(__dirname, '..', 'server', 'database.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

  console.log('📄 Đang chạy file database.sql...');
  await connection.query(sqlContent);
  console.log('✅ Đã nạp thành công database.sql (bảng, danh mục, đơn hàng, người dùng)!');

  await connection.end();

  // Chạy nạp thêm sản phẩm đợt 1
  console.log('\n📦 Đang nạp sản phẩm đợt 1...');
  const { execSync } = require('child_process');
  execSync('node scripts/seed-products.js', { stdio: 'inherit' });

  console.log('\n📦 Đang nạp sản phẩm đợt 2...');
  execSync('node scripts/seed-products-batch2.js', { stdio: 'inherit' });

  console.log('\n🎉 ĐÃ KHẮC PHỤC XONG LỖI FONT TIẾNG VIỆT CHO TOÀN BỘ DATABASE MAYTINH!');
}

fixEncoding().catch((err) => {
  console.error('❌ Lỗi:', err.message || err);
  process.exit(1);
});
