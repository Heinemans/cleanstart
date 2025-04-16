import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface BaggageTime extends RowDataPacket {
  id: number;
  time: string;
  type: 'heen' | 'terug' | 'overig';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const [rows] = await db.execute<BaggageTime[]>(
      'SELECT * FROM baggage_times ORDER BY time ASC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch baggage times' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { time, type, active = true } = await request.json();

    // Validation
    if (!time) {
      return NextResponse.json(
        { error: 'Time is required' },
        { status: 400 }
      );
    }

    if (!['heen', 'terug', 'overig'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be one of: heen, terug, overig' },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      'INSERT INTO baggage_times (time, type, active) VALUES (?, ?, ?)',
      [time, type, active]
    );

    // @ts-ignore
    const id = result.insertId;

    const [rows] = await db.execute<BaggageTime[]>(
      'SELECT * FROM baggage_times WHERE id = ?',
      [id]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create baggage time' },
      { status: 500 }
    );
  }
} 