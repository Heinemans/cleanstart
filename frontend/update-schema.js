// Script to update the database schema
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function updateSchema() {
  console.log('Updating database schema...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME
    });
    
    // First, rename the current items table to rental_items if it doesn't already exist
    try {
      // Check if rental_items already exists
      const [rentalItemsCheck] = await connection.query("SHOW TABLES LIKE 'rental_items'");
      
      if (rentalItemsCheck.length === 0) {
        console.log('Renaming current items table to rental_items...');
        await connection.query('RENAME TABLE items TO rental_items');
        console.log('Table renamed successfully');
      } else {
        console.log('rental_items table already exists, skipping rename');
      }
    } catch (renameError) {
      console.error('Error renaming table:', renameError.message);
    }
    
    // Create the correct items table according to schema
    try {
      console.log('Creating new items table with the correct structure...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS items (
          id INT NOT NULL AUTO_INCREMENT,
          item_number VARCHAR(50) NOT NULL UNIQUE,
          brand VARCHAR(100) NOT NULL,
          model_type VARCHAR(100) NOT NULL,
          gender VARCHAR(1) NOT NULL,
          brake_type VARCHAR(100) NOT NULL,
          frame_height VARCHAR(100) NOT NULL,
          wheel_size VARCHAR(50) NOT NULL,
          color VARCHAR(50) NOT NULL,
          year INT NOT NULL,
          license_plate VARCHAR(50) NOT NULL,
          lock_type VARCHAR(100) NOT NULL,
          frame_number VARCHAR(100) NOT NULL UNIQUE,
          lock_number VARCHAR(50) NOT NULL,
          key_number VARCHAR(50) NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'available',
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          price_code_id INT,
          item_type_id INT NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (item_type_id) REFERENCES item_types(id),
          FOREIGN KEY (price_code_id) REFERENCES price_codes(id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('Items table created successfully');
    } catch (createError) {
      console.error('Error creating items table:', createError.message);
    }
    
    // Update foreign keys in rental_items
    try {
      // First, check if rental_items has item_id column and ensure it references items(id)
      console.log('Updating foreign keys in rental_items...');
      const [columns] = await connection.query("SHOW COLUMNS FROM rental_items LIKE 'item_id'");
      
      if (columns.length > 0) {
        // Drop the constraint first if it exists
        try {
          // We need to find the constraint name first
          const [constraints] = await connection.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_NAME = 'rental_items' 
            AND COLUMN_NAME = 'item_id' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
          `);
          
          if (constraints.length > 0) {
            const constraintName = constraints[0].CONSTRAINT_NAME;
            await connection.query(`
              ALTER TABLE rental_items 
              DROP FOREIGN KEY ${constraintName}
            `);
            console.log(`Dropped foreign key constraint: ${constraintName}`);
          }
        } catch (constraintError) {
          console.error('Error dropping constraint:', constraintError.message);
        }
        
        // Add the constraint to reference the new items table
        try {
          await connection.query(`
            ALTER TABLE rental_items
            ADD CONSTRAINT fk_rental_items_item_id
            FOREIGN KEY (item_id) REFERENCES items(id)
          `);
          console.log('Added foreign key constraint to rental_items.item_id');
        } catch (addConstraintError) {
          console.error('Error adding constraint:', addConstraintError.message);
        }
      }
    } catch (foreignKeyError) {
      console.error('Error updating foreign keys:', foreignKeyError.message);
    }
    
    console.log('Schema update completed');
    await connection.end();
  } catch (error) {
    console.error('Error updating schema:', error.message);
  }
}

updateSchema(); 