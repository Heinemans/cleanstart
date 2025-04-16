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

    const [rows] = await db.execute<BoatTime[]>(
      'SELECT * FROM boat_times WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Boat time not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boat time' },
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

    const { time, type, service_type, active } = await request.json();
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

    if (service_type !== undefined) {
      if (!['gewoon', 'sneldienst'].includes(service_type)) {
        return NextResponse.json(
          { error: 'Service type must be one of: gewoon, sneldienst' },
          { status: 400 }
        );
      }
      updateFields.push('service_type = ?');
      updateValues.push(service_type);
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
      `UPDATE boat_times SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Boat time not found' },
        { status: 404 }
      );
    }

    const [rows] = await db.execute<BoatTime[]>(
      'SELECT * FROM boat_times WHERE id = ?',
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update boat time' },
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
      'DELETE FROM boat_times WHERE id = ?',
      [id]
    );

    // @ts-ignore
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Boat time not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to delete boat time' },
      { status: 500 }
    );
  }
} 