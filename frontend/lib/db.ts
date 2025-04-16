import mysql from 'mysql2/promise';

export interface QueryResult<T = any> {
  [key: number]: T[];
  length: number;
}

// Log database connection parameters (without sensitive data)
console.log('Database connection settings:', {
  host: process.env.NEXT_PUBLIC_DB_HOST,
  user: process.env.NEXT_PUBLIC_DB_USER,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  hasPassword: !!process.env.NEXT_PUBLIC_DB_PASSWORD,
});

const pool = mysql.createPool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connection established successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Failed to establish database connection:', err);
  });

export default pool; 