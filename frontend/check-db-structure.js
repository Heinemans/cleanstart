// Script to check the database structure
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkDatabaseStructure() {
  console.log('Checking database structure...');
  console.log('Connection info:', {
    host: process.env.NEXT_PUBLIC_DB_HOST,
    user: process.env.NEXT_PUBLIC_DB_USER,
    database: process.env.NEXT_PUBLIC_DB_NAME,
    hasPassword: !!process.env.NEXT_PUBLIC_DB_PASSWORD
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME
    });

    console.log('Connection established');
    
    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Tables in database:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    // Check items table structure
    console.log('\nChecking items table structure:');
    try {
      const [columns] = await connection.query('SHOW COLUMNS FROM items');
      console.log('Columns in items table:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
      });
      
      // Get sample data
      const [rows] = await connection.query('SELECT * FROM items LIMIT 1');
      if (rows.length > 0) {
        console.log('\nSample item row:');
        console.log(rows[0]);
      } else {
        console.log('\nNo items found in the table');
      }
    } catch (itemsError) {
      console.error('\nError checking items table:', itemsError.message);
    }
    
    // Check if price_codes table exists and its structure
    console.log('\nChecking price_codes table structure:');
    try {
      const [columns] = await connection.query('SHOW COLUMNS FROM price_codes');
      console.log('Columns in price_codes table:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
      });
    } catch (priceCodesError) {
      console.error('Error checking price_codes table:', priceCodesError.message);
    }
    
    // Check if item_types table exists and its structure
    console.log('\nChecking item_types table structure:');
    try {
      const [columns] = await connection.query('SHOW COLUMNS FROM item_types');
      console.log('Columns in item_types table:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
      });
    } catch (itemTypesError) {
      console.error('Error checking item_types table:', itemTypesError.message);
    }
    
    await connection.end();
    console.log('\nDatabase check complete');
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
}

checkDatabaseStructure(); 