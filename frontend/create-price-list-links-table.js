// Script to create the price_list_links table
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function createPriceListLinksTable() {
  console.log('Starting script to create price_list_links table...');
  console.log('Environment variables:');
  console.log('- DB_HOST:', process.env.NEXT_PUBLIC_DB_HOST);
  console.log('- DB_USER:', process.env.NEXT_PUBLIC_DB_USER);
  console.log('- DB_NAME:', process.env.NEXT_PUBLIC_DB_NAME);
  console.log('- Has DB_PASSWORD:', process.env.NEXT_PUBLIC_DB_PASSWORD ? 'Yes' : 'No');
  
  try {
    console.log('Attempting to establish database connection...');
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME
    });
    
    console.log('Connection established successfully');
    
    // Check existing tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('Existing tables in database:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    // Check if price_list_links already exists
    const priceListLinksExists = tables.some(table => Object.values(table)[0] === 'price_list_links');
    console.log('price_list_links table exists:', priceListLinksExists);
    
    // If price_list_links exists, drop it to create it with the correct structure
    if (priceListLinksExists) {
      console.log('Dropping existing price_list_links table to recreate it...');
      await connection.query('DROP TABLE price_list_links');
      console.log('Existing price_list_links table dropped successfully');
    }
    
    // Check for price_lists table
    const priceListsExists = tables.some(table => Object.values(table)[0] === 'price_lists');
    console.log('price_lists table exists:', priceListsExists);
    
    // Check for price_codes table
    const priceCodesExists = tables.some(table => Object.values(table)[0] === 'price_codes');
    console.log('price_codes table exists:', priceCodesExists);
    
    // Create price_lists if needed
    if (!priceListsExists) {
      console.log('Creating price_lists table first...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS price_lists (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('price_lists table created successfully');
    }
    
    // Check price_codes structure if it exists
    if (priceCodesExists) {
      console.log('Checking price_codes table structure...');
      const [priceCodesColumns] = await connection.query('SHOW COLUMNS FROM price_codes');
      console.log('price_codes columns:');
      priceCodesColumns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type})`);
      });
      
      // Get the id column type
      const idColumn = priceCodesColumns.find(col => col.Field === 'id');
      if (idColumn) {
        console.log('price_codes.id type:', idColumn.Type);
        
        // Create the price_list_links table
        console.log('Creating price_list_links table with the correct structure...');
        await connection.query(`
          CREATE TABLE price_list_links (
            id INT NOT NULL AUTO_INCREMENT,
            price_list_id INT NOT NULL,
            price_code_id INT NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            daily_prices JSON NOT NULL,
            price_extra_day DECIMAL(10,2) NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            
            PRIMARY KEY (id),
            FOREIGN KEY (price_list_id) REFERENCES price_lists(id) ON DELETE CASCADE,
            FOREIGN KEY (price_code_id) REFERENCES price_codes(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);
        console.log('price_list_links table created successfully');
      } else {
        throw new Error('Could not find id column in price_codes table');
      }
    } else {
      console.log('Error: price_codes table does not exist');
      console.log('Please ensure the price_codes table exists before creating price_list_links');
    }
    
    // Verify the creation of price_list_links
    const [verifyTable] = await connection.query("SHOW TABLES LIKE 'price_list_links'");
    if (verifyTable.length > 0) {
      console.log('Successfully verified price_list_links table exists');
      
      // Show the structure of the created table
      const [columns] = await connection.query('SHOW COLUMNS FROM price_list_links');
      console.log('price_list_links table structure:');
      columns.forEach(col => {
        console.log(`- ${col.Field} (${col.Type}) ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'} ${col.Key} ${col.Default ? `DEFAULT ${col.Default}` : ''}`);
      });
      
      // Show the creation SQL
      const [createSQL] = await connection.query('SHOW CREATE TABLE price_list_links');
      console.log('\nTable creation SQL:');
      console.log(createSQL[0]['Create Table']);
    } else {
      console.log('Failed to verify table creation, table not found');
    }
    
    console.log('Creation process completed');
    await connection.end();
  } catch (error) {
    console.error('Error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
  }
}

createPriceListLinksTable().catch(console.error); 