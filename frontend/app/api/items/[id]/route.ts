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
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Parse the request body
    const body = await req.json();
    console.log(`PUT /api/items/${id}:`, body);
    
    // Build the update query dynamically based on the fields provided
    const updateFields = [];
    const updateValues = [];
    
    // Check which fields are present in the request body
    for (const [key, value] of Object.entries(body)) {
      // Skip id, created_at, and updated_at
      if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }
    
    // If no valid fields are provided, return an error
    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      );
    }
    
    // Add the item id to the values array
    updateValues.push(id);
    
    // Create the SQL query
    const sql = `
      UPDATE items
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    console.log('Update SQL:', sql);
    console.log('Update values:', updateValues);
    
    // Execute the update
    const [result] = await db.query(sql, updateValues);
    
    // Get the updated item
    const [updatedRows] = await db.query(`
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
      WHERE i.id = ?
    `, [id]);
    
    // Transform the updated item to include nested objects
    const updatedItems = Array.isArray(updatedRows) && updatedRows.length > 0 ? updatedRows.map((row: any) => {
      const item = { ...row };
      
      // Add item_type object if item_type_id exists
      if (row.item_type_id) {
        item.item_type = {
          id: row.item_type_id,
          name: row.item_type_name
        };
        delete item.item_type_name;
      }
      
      // Add price_code object if price_code_id exists
      if (row.price_code_id) {
        item.price_code = {
          id: row.price_code_id,
          code: row.price_code,
          label: row.price_code_label
        };
        delete item.price_code;
        delete item.price_code_label;
      }
      
      return item;
    }) : [];
    
    return NextResponse.json(updatedItems[0] || {});
  } catch (error) {
    console.error(`❌ Error updating item ${id}:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to update item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    // Check if the item exists
    const [existingItems] = await db.query(
      'SELECT * FROM items WHERE id = ?',
      [id]
    );
    
    if (!Array.isArray(existingItems) || existingItems.length === 0) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    // Delete the item
    await db.query('DELETE FROM items WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error(`❌ Error deleting item ${id}:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to delete item',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 