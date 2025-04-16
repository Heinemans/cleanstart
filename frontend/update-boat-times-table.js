const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  console.log('Updating boat_times table structure...');

  // Create a connection to the database
  const connection = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_DB_HOST || 'localhost',
    user: process.env.NEXT_PUBLIC_DB_USER || 'root',
    password: process.env.NEXT_PUBLIC_DB_PASSWORD || '',
    database: process.env.NEXT_PUBLIC_DB_NAME || 'rental_db',
  });

  try {
    // Check if the boat_times table exists
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'boat_times'"
    );

    if (tables.length === 0) {
      console.log('Creating boat_times table...');
      
      // Create the boat_times table
      await connection.query(`
        CREATE TABLE boat_times (
          id INT AUTO_INCREMENT PRIMARY KEY,
          time TIME NOT NULL,
          type ENUM('heen', 'terug', 'overig') NOT NULL,
          service_type ENUM('gewoon', 'sneldienst') NOT NULL DEFAULT 'gewoon',
          active BOOLEAN DEFAULT TRUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      console.log('boat_times table created successfully');
    } else {
      // Check if the service_type column exists
      const [columns] = await connection.query(
        "SHOW COLUMNS FROM boat_times LIKE 'service_type'"
      );

      if (columns.length === 0) {
        console.log('Adding service_type column to boat_times table...');
        
        // Add the service_type column
        await connection.query(`
          ALTER TABLE boat_times 
          ADD COLUMN service_type ENUM('gewoon', 'sneldienst') NOT NULL DEFAULT 'gewoon' 
          AFTER type
        `);
        
        console.log('service_type column added successfully');
      } else {
        console.log('service_type column already exists');
      }
    }

    console.log('boat_times table is up to date!');
  } catch (error) {
    console.error('Error updating boat_times table:', error);
  } finally {
    await connection.end();
  }
}

main(); 