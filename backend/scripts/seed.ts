import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Try to find and load environment variables
const envPaths = [
  '../.env',
  '../../.env',
  '.env'
];

let envFound = false;
for (const envPath of envPaths) {
  const fullPath = path.resolve(__dirname, envPath);
  if (fs.existsSync(fullPath)) {
    console.log(`Found .env file at: ${fullPath}`);
    dotenv.config({ path: fullPath });
    envFound = true;
    break;
  }
}

if (!envFound) {
  console.warn('No .env file found. Using default database connection settings.');
}

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'rental_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function seedUser() {
  try {
    console.log('Connecting to database with settings:');
    console.log({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'rental_db'
    });
    
    // Check if connection works
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Check if users table exists
    try {
      const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', ['user@example.com']);
      
      if ((existing as any[]).length === 0) {
        const hashed = await bcrypt.hash('password123', 10);
        await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [
          'user@example.com',
          hashed
        ]);
        console.log('✅ Test user created successfully');
      } else {
        console.log('ℹ️ Test user already exists');
      }
    } catch (error: any) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.error('❌ The users table does not exist. Please create it first.');
      } else {
        throw error;
      }
    }
  } catch (error: any) {
    console.error('❌ Error seeding user:');
    if (error.code === 'ECONNREFUSED') {
      console.error('  Could not connect to MySQL server. Make sure it is running.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  Access denied. Check your database username and password.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`  Database '${process.env.DB_NAME || 'rental_db'}' does not exist.`);
    } else {
      console.error('  ', error);
    }
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
    console.log('Database connection closed');
  }
}

// Export for importing in other files
export default seedUser;

// If run directly as a script
if (require.main === module) {
  seedUser().then(() => {
    console.log('Seed process completed');
    process.exit(0);
  });
} 