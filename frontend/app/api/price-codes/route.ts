import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface PriceCode extends RowDataPacket {
  id: number;
  code: string;
  label: string;
}

export async function GET() {
  try {
    const [rows] = await db.query<PriceCode[]>(
      'SELECT * FROM price_codes ORDER BY code ASC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching price codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price codes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { code, label } = await req.json();

    if (!code || !label) {
      return new Response('Code and label are required', { status: 400 });
    }

    // Check if code already exists
    const [existing] = await db.query<PriceCode[]>(
      'SELECT * FROM price_codes WHERE code = ?',
      [code]
    );

    if (existing.length > 0) {
      return new Response('Price code already exists', { status: 400 });
    }

    await db.query(
      'INSERT INTO price_codes (code, label) VALUES (?, ?)',
      [code, label]
    );

    return new Response('Created', { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/price-codes failed:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 