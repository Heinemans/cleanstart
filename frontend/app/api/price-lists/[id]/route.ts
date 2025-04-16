import { NextResponse } from 'next/server';
import db, { QueryResult } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { name, valid_from, valid_until, is_active } = data;
    const id = parseInt(params.id);

    await db.query(
      'UPDATE price_lists SET name = ?, valid_from = ?, valid_until = ?, is_active = ? WHERE id = ?',
      [name, valid_from, valid_until, is_active, id]
    );

    const [updatedPriceList] = await db.query<QueryResult>(
      'SELECT * FROM price_lists WHERE id = ?',
      [id]
    );

    return NextResponse.json(updatedPriceList[0]);
  } catch (error) {
    console.error('Error updating price list:', error);
    return NextResponse.json(
      { error: 'Failed to update price list' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.query('DELETE FROM price_lists WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting price list:', error);
    return NextResponse.json(
      { error: 'Failed to delete price list' },
      { status: 500 }
    );
  }
} 