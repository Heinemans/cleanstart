import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface ItemType extends RowDataPacket {
  id: number;
  name: string;
  description: string | null;
}

export async function GET() {
  try {
    const [rows] = await db.query<ItemType[]>(
      'SELECT * FROM item_types ORDER BY name ASC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching item types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item types' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    if (!name) {
      return new Response('Name is required', { status: 400 });
    }

    // Check if name already exists
    const [existing] = await db.query<ItemType[]>(
      'SELECT * FROM item_types WHERE name = ?',
      [name]
    );

    if (existing.length > 0) {
      return new Response('Item type with this name already exists', { status: 400 });
    }

    await db.query(
      'INSERT INTO item_types (name, description) VALUES (?, ?)',
      [name, description]
    );

    return new Response('Created', { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/item-types failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 