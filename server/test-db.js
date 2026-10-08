require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL Connection...\n');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'maytinh',
    });

    console.log('✅ Connected to MySQL successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME || 'maytinh'}`);
    console.log(`👤 User: ${process.env.DB_USER || 'root'}`);
    console.log(`🖥️  Host: ${process.env.DB_HOST || 'localhost'}\n`);

    // Check tables
    console.log('📋 Checking tables...\n');
    const [tables] = await connection.query('SHOW TABLES');
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found! Please import database.sql');
    } else {
      console.log(`✅ Found ${tables.length} tables:`);
      tables.forEach((table, i) => {
        const tableName = Object.values(table)[0];
        console.log(`   ${i + 1}. ${tableName}`);
      });
    }

    // Check categories count
    const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
    console.log(`\n📦 Categories: ${categories[0].count} records`);

    // Check products count
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    console.log(`🛍️  Products: ${products[0].count} records`);

    console.log('\n✅ Database setup is ready!');
    console.log('▶️  Run: npm run backend');

    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n⚠️  Make sure:');
    console.error('  1. MySQL is running (XAMPP)');
    console.error('  2. Database "maytinh" exists');
    console.error('  3. .env.local has correct DB credentials\n');
    process.exit(1);
  }
}

testConnection();
