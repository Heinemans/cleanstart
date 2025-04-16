import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface BoatTime extends RowDataPacket {
  id: number;
  time: string;
  type: 'heen' | 'terug' | 'overig';
  service_type: 'gewoon' | 'sneldienst';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export async function GET() {
  try {
    const [rows] = await db.execute<BoatTime[]>(
      'SELECT * FROM boat_times ORDER BY type ASC, time ASC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boat times' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { time, type, service_type = 'gewoon', active = true } = await request.json();

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

    if (!['gewoon', 'sneldienst'].includes(service_type)) {
      return NextResponse.json(
        { error: 'Service type must be one of: gewoon, sneldienst' },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      'INSERT INTO boat_times (time, type, service_type, active) VALUES (?, ?, ?, ?)',
      [time, type, service_type, active]
    );

    // @ts-ignore
    const id = result.insertId;

    const [rows] = await db.execute<BoatTime[]>(
      'SELECT * FROM boat_times WHERE id = ?',
      [id]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create boat time' },
      { status: 500 }
    );
  }
} 