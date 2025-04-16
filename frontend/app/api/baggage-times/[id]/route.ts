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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const [rows] = await db.execute<BaggageTime[]>(
      'SELECT * FROM baggage_times WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Baggage time not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch baggage time' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const { time, type, active } = await request.json();
    const updateFields = [];
    const updateValues = [];

    if (time !== undefined) {
      updateFields.push('time = ?');
      updateValues.push(time);
    }

    if (type !== undefined) {
      if (!['heen', 'terug', 'overig'].includes(type)) {
        return NextResponse.json(
          { error: 'Type must be one of: heen, terug, overig' },
          { status: 400 }
        );
      }
      updateFields.push('type = ?');
      updateValues.push(type);
    }

    if (active !== undefined) {
      updateFields.push('active = ?');
      updateValues.push(active);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Add ID at the end for the WHERE clause
    updateValues.push(id);

    const [result] = await db.execute(
      `UPDATE baggage_times SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Baggage time not found' },
        { status: 404 }
      );
    }

    const [rows] = await db.execute<BaggageTime[]>(
      'SELECT * FROM baggage_times WHERE id = ?',
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update baggage time' },
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
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      'DELETE FROM baggage_times WHERE id = ?',
      [id]
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Baggage time not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete baggage time' },
      { status: 500 }
    );
  }
} 