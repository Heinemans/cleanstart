import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ItemType extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { name, description } = await req.json();

    if (!name) {
      return new Response('Name is required', { status: 400 });
    }

    if (name.length > 100) {
      return new Response('Name must be less than 100 characters', { status: 400 });
    }

    // Check if name already exists for another record
    const [existing] = await db.query<ItemType[]>(
      'SELECT * FROM item_types WHERE name = ? AND id != ?',
      [name, id]
    );

    if (existing.length > 0) {
      return new Response('Item type with this name already exists', { status: 400 });
    }

    await db.query(
      'UPDATE item_types SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    return new Response('Updated', { status: 200 });
  } catch (error) {
    console.error('❌ PUT /api/item-types/[id] failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await db.query('DELETE FROM item_types WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item type:', error);
    return NextResponse.json(
      { error: 'Failed to delete item type' },
      { status: 500 }
    );
  }
} 