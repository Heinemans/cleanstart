import { NextResponse } from 'next/server';
import db, { QueryResult } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query<QueryResult>(
      'SELECT * FROM price_lists ORDER BY valid_from DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching price lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, valid_from, valid_until, is_active } = data;

    const [result] = await db.query<QueryResult>(
      'INSERT INTO price_lists (name, valid_from, valid_until, is_active) VALUES (?, ?, ?, ?)',
      [name, valid_from, valid_until, is_active]
    );

    const [newPriceList] = await db.query<QueryResult>(
      'SELECT * FROM price_lists WHERE id = ?',
      [(result as any).insertId]
    );

    return NextResponse.json(newPriceList[0]);
  } catch (error) {
    console.error('Error creating price list:', error);
    return NextResponse.json(
      { error: 'Failed to create price list' },
      { status: 500 }
    );
  }
} 