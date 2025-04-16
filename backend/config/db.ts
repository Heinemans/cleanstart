import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

import mysql from 'mysql2/promise';

console.log('🔍 DB CONFIG:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
