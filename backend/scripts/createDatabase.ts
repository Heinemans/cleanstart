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

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const [rows] = await connection.query("SHOW DATABASES LIKE 'rental_db'");
    if ((rows as any[]).length === 0) {
      await connection.query('CREATE DATABASE rental_db');
      console.log('✅ Database rental_db created');
    } else {
      console.log('ℹ️ Database rental_db already exists');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  }
})();

// Export for importing in other files
export default async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const [rows] = await connection.query("SHOW DATABASES LIKE 'rental_db'");
    if ((rows as any[]).length === 0) {
      await connection.query('CREATE DATABASE rental_db');
      console.log('✅ Database rental_db created');
    } else {
      console.log('ℹ️ Database rental_db already exists');
    }

    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error creating database:', error);
    return false;
  }
} 