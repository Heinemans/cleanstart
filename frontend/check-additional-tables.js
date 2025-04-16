// Script to check for additional tables
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkForInventoryTables() {
  console.log('Looking for inventory-related tables...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME
    });
    
    // Get all table names first
    const [tables] = await connection.query('SHOW TABLES');
    const tableNames = tables.map(table => Object.values(table)[0]);
    console.log('All tables:', tableNames);
    
    // Look for any table with "item" in the name or inventory-related tables
    const possibleItemTables = tableNames.filter(name => 
      name.includes('item') || 
      name.includes('inventory') || 
      name.includes('product') ||
      name.includes('bike') ||
      name.includes('fiets') ||
      name.includes('verhuur')
    );
    
    console.log('\nPossible inventory tables:', possibleItemTables);
    
    // Check columns for each of these tables
    for (const tableName of possibleItemTables) {
      console.log(`\nChecking structure of '${tableName}' table:`);
      try {
        const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
        columns.forEach(col => {
          console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
        });
        
        // Show first row as example
        const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 1`);
        if (rows.length > 0) {
          console.log(`\nSample row from '${tableName}':`);
          console.log(rows[0]);
        } else {
          console.log(`\nNo data in '${tableName}' table.`);
        }
      } catch (error) {
        console.error(`Error checking table '${tableName}':`, error.message);
      }
    }
    
    // Query the creation schema for the items table
    try {
      const [createSchema] = await connection.query(`SHOW CREATE TABLE items`);
      console.log('\nItems table creation schema:');
      console.log(createSchema[0]['Create Table']);
    } catch (error) {
      console.error('Error getting creation schema for items table:', error.message);
    }
    
    await connection.end();
    console.log('\nSearch complete');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkForInventoryTables(); 