import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface PriceCode extends RowDataPacket {
  id: number;
  code: string;
  label: string;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { code, label } = await req.json();

    if (!code || !label) {
      return new Response('Code and label are required', { status: 400 });
    }

    // Check if code already exists for another record
    const [existing] = await db.query<PriceCode[]>(
      'SELECT * FROM price_codes WHERE code = ? AND id != ?',
      [code, id]
    );

    if (existing.length > 0) {
      return new Response('Price code already exists', { status: 400 });
    }

    await db.query(
      'UPDATE price_codes SET code = ?, label = ? WHERE id = ?',
      [code, label, id]
    );

    return new Response('Updated', { status: 200 });
  } catch (error) {
    console.error('❌ PUT /api/price-codes/[id] failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.query('DELETE FROM price_codes WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting price code:', error);
    return NextResponse.json(
      { error: 'Failed to delete price code' },
      { status: 500 }
    );
  }
} 