import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ItemRow extends RowDataPacket {
  id: number;
  item_number: string;
  brand: string;
  model_type: string;
  frame_number: string;
  key_number: string;
  lock_number: string;
  status: 'available' | 'maintenance' | 'defect';
  item_type_id: number;
  price_code_id: number;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    console.log("GET /api/items: Starting request");
    
    // Check if we can connect to the database
    try {
      const [connectionResult] = await db.query("SELECT 1 as test");
      console.log("Database connection test:", connectionResult);
    } catch (connError) {
      console.error("Database connection error:", connError);
      return NextResponse.json({
        error: 'Database connection failed',
        message: connError instanceof Error ? connError.message : 'Unknown error'
      }, { status: 500 });
    }
    
    // Eerste stap: controleer of de items tabel bestaat
    try {
      const [tablesResult] = await db.query(
        "SHOW TABLES LIKE 'items'"
      );
      
      console.log("Tables check result:", tablesResult);
      
      if (Array.isArray(tablesResult) && tablesResult.length === 0) {
        console.log("The 'items' table does not exist in the database");
        
        // Return empty array with 200 instead of error
        return NextResponse.json([]);
      }
    } catch (tableError) {
      console.error("Error checking tables:", tableError);
    }
    
    // Complete query with joins to get item_type and price_code data
    const query = `
      SELECT 
        i.*,
        it.id as item_type_id,
        it.name as item_type_name,
        pc.id as price_code_id,
        pc.code as price_code,
        pc.label as price_code_label
      FROM items i
      LEFT JOIN item_types it ON i.item_type_id = it.id
      LEFT JOIN price_codes pc ON i.price_code_id = pc.id
    `;
    
    console.log("Running query:", query);
    const [rows] = await db.query(query);
    
    console.log(`GET /api/items: Found ${Array.isArray(rows) ? rows.length : 0} items`);
    
    // Transform rows to include nested objects
    const itemsWithNestedObjects = Array.isArray(rows) ? rows.map((row: any) => {
      const item = { ...row };
      
      // Add item_type object if item_type_id exists
      if (row.item_type_id) {
        item.item_type = {
          id: row.item_type_id,
          name: row.item_type_name
        };
        // Remove redundant fields
        delete item.item_type_name;
      }
      
      // Add price_code object if price_code_id exists
      if (row.price_code_id) {
        item.price_code = {
          id: row.price_code_id,
          code: row.price_code,
          label: row.price_code_label
        };
        // Remove redundant fields - but don't delete the price_code object we just created
        delete item.price_code_label;
      }
      
      return item;
    }) : [];
    
    return NextResponse.json(itemsWithNestedObjects);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch items',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Received data for creating item:', data);
    
    // First, check the actual table structure to debug
    try {
      const [columns] = await db.query('SHOW COLUMNS FROM items');
      console.log('Items table structure:', columns);
      
      // Get the first row to see what's in the table
      const [firstRow] = await db.query('SELECT * FROM items LIMIT 1');
      console.log('First item row:', firstRow);
    } catch (structureError) {
      console.error('Error getting table structure:', structureError);
      return NextResponse.json({
        error: 'Error getting table structure',
        message: structureError instanceof Error ? structureError.message : 'Unknown error'
      }, { status: 500 });
    }
    
    const { 
      item_number, 
      brand, 
      model_type,
      gender,
      brake_type,
      frame_height,
      wheel_size,
      color,
      year,
      license_plate,
      lock_type,
      frame_number, 
      key_number, 
      lock_number, 
      status, 
      item_type_id, 
      price_code_id 
    } = data;

    // Adjust this query based on actual column name for item_number
    try {
      // Try to find a unique identifier column (item_number or similar)
      const [existing] = await db.query(
        'SELECT * FROM items WHERE id = ? OR frame_number = ?',
        [item_number, frame_number]
      );

      if (Array.isArray(existing) && existing.length > 0) {
        return NextResponse.json({ error: 'Item ID or frame number already exists' }, { status: 400 });
      }
    } catch (checkError) {
      console.error('Error checking for existing item:', checkError);
      return NextResponse.json({
        error: 'Database error while checking for existing item',
        message: checkError instanceof Error ? checkError.message : 'Unknown error'
      }, { status: 500 });
    }

    try {
      // Log the SQL parameters
      const params = [
        item_number, brand, model_type, gender, brake_type, frame_height, 
        wheel_size, color, year, license_plate, lock_type,
        frame_number, lock_number, key_number, status, 
        item_type_id, price_code_id
      ];
      console.log('SQL parameters:', params);
      
      // We'll try to insert using dynamic query building based on actual columns
      const [result] = await db.query(
        `INSERT INTO items (
          item_number, brand, model_type, gender, brake_type, frame_height, 
          wheel_size, color, year, license_plate, lock_type,
          frame_number, lock_number, key_number, status, 
          item_type_id, price_code_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params
      );

      console.log('Insert result:', result);
      return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 });
    } catch (insertError) {
      console.error('Error inserting new item:', insertError);
      return NextResponse.json({
        error: 'Database error while creating item',
        message: insertError instanceof Error ? insertError.message : 'Unknown error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ POST /api/items failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to create item',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 