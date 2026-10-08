/**
 * Script seed tài khoản admin + user mẫu vào MySQL
 * Chạy: node server/seed-users.js
 */
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function seedUsers() {
  console.log('🔄 Đang kết nối MySQL...\n');

  const targetDatabases = ['maytinh', 'promart'];

  for (const dbName of targetDatabases) {
    let connection;
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: dbName,
        charset: 'utf8mb4',
      });

      console.log(`\n======================================================`);
      console.log(`📦 ĐANG SEED VÀO DATABASE: "${dbName}"`);
      console.log(`======================================================`);

      // 1. Seed Admin 1
      await connection.query(`
        INSERT INTO users (email, password, name, phone, address, city, role, avatar)
        VALUES ('admin@promart.vn', '1', 'Quản Trị Viên DANGVINHPC', '0900 000 000',
                '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'admin',
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80')
        ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name), phone=VALUES(phone), role='admin'
      `);
      console.log('✅ Tạo admin: admin@promart.vn / mật khẩu: 1');

      // 2. Seed Admin 2
      await connection.query(`
        INSERT INTO users (email, password, name, phone, address, city, role, avatar)
        VALUES ('admin@dangvinhpc.vn', '1', 'Quản Trị Viên DANGVINHPC', '0900 000 001',
                '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'admin',
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80')
        ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name), phone=VALUES(phone), role='admin'
      `);
      console.log('✅ Tạo admin: admin@dangvinhpc.vn / mật khẩu: 1');

      // 3. Seed Staff 1 (Nhân viên kinh doanh & CSKH)
      await connection.query(`
        INSERT INTO users (email, password, name, phone, address, city, role, avatar)
        VALUES ('staff@dangvinhpc.vn', '1', 'Nhân Viên Kinh Doanh DANGVINHPC', '0900 111 222',
                '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'staff',
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80')
        ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name), phone=VALUES(phone), role='staff', avatar=VALUES(avatar)
      `);
      console.log('✅ Tạo nhân viên: staff@dangvinhpc.vn / mật khẩu: 1');

      // 4. Seed Staff 2 (Nhân viên quản lý kho)
      await connection.query(`
        INSERT INTO users (email, password, name, phone, address, city, role, avatar)
        VALUES ('kho@dangvinhpc.vn', '1', 'Nhân Viên Quản Lý Kho DANGVINHPC', '0900 111 333',
                '191 Nguyễn Thị Duệ, Phường Thanh Bình', 'TP. Hải Dương', 'staff',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80')
        ON DUPLICATE KEY UPDATE password=VALUES(password), name=VALUES(name), phone=VALUES(phone), role='staff', avatar=VALUES(avatar)
      `);
      console.log('✅ Tạo nhân viên kho: kho@dangvinhpc.vn / mật khẩu: 1');

      // 5. Seed Customer mẫu
      await connection.query(`
        INSERT INTO users (email, password, name, phone, address, city, role, avatar)
        VALUES ('nguyenvana@gmail.com', 'password123', 'Nguyễn Văn A', '0909123456',
                '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1', 'TP. Hồ Chí Minh', 'customer',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
        ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone)
      `);
      console.log('✅ Tạo khách hàng: nguyenvana@gmail.com / mật khẩu: password123');

      // 6. Kiểm tra kết quả
      const [users] = await connection.query('SELECT id, email, name, phone, role FROM users');
      console.log(`\n📊 Tổng số users trong database "${dbName}": ${users.length}`);
      console.log('─'.repeat(70));
      users.forEach(u => {
        console.log(`  ID: ${u.id} | ${u.email} | ${u.name} | Role: ${u.role}`);
      });
      console.log('─'.repeat(70));

      await connection.end();
    } catch (error) {
      console.warn(`⚠️ Bỏ qua hoặc lỗi database "${dbName}":`, error.message);
      if (connection) await connection.end();
    }
  }

  console.log('\n🎉 ĐÃ CẬP NHẬT TẤT CẢ DATABASE THÀNH CÔNG!');
  console.log('👉 Bạn có thể mở phpMyAdmin và F5 để thấy ngay tài khoản:');
  console.log('   - staff@dangvinhpc.vn (role: staff)');
  console.log('   - kho@dangvinhpc.vn (role: staff)');
  console.log('   - admin@promart.vn (role: admin)\n');
}

seedUsers();
