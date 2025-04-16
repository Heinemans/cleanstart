import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// Define the accommodation type interface as a plain object
interface AccommodationType {
  id: number;
  name: string;
  active: boolean;
  created_at: string;
}

// Database-specific type that extends the base type
interface AccommodationTypeRow extends AccommodationType, RowDataPacket {}

// Declare global property to make TypeScript happy
declare global {
  var dummyAccommodationTypes: AccommodationType[] | undefined;
}

// Use a simple approach for dummy data in development
// In a real app, you would use a proper database
const dummyData: AccommodationType[] = global.dummyAccommodationTypes = global.dummyAccommodationTypes || [
  { id: 1, name: "Bungalow", active: true, created_at: new Date().toISOString() },
  { id: 2, name: "Tentplaats", active: true, created_at: new Date().toISOString() },
  { id: 3, name: "Hotel", active: true, created_at: new Date().toISOString() },
  { id: 4, name: "Vakantiehuis", active: true, created_at: new Date().toISOString() }
];

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  const { id } = params;
  
  try {
    try {
      // Try to get from database first
      const [rows] = await db.query<AccommodationTypeRow[]>(
        'SELECT * FROM accommodation_types WHERE id = ?',
        [id]
      );
      
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json(rows[0]);
      }
      
      return NextResponse.json({ error: 'Accommodation type not found' }, { status: 404 });
    } catch (error) {
      // If database operation fails, check dummy data
      console.error('Error fetching from database:', error);
      
      // Get from dummy data
      const item = dummyData.find(item => item.id === parseInt(id));
      
      if (item) {
        return NextResponse.json(item);
      }
      
      return NextResponse.json({ error: 'Accommodation type not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching accommodation type:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accommodation type' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;
  
  try {
    try {
      // Try to delete from database first
      await db.query('DELETE FROM accommodation_types WHERE id = ?', [id]);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting from database:', error);
      
      // For dummy data, find and remove the item from the global array
      const idNum = parseInt(id);
      const index = dummyData.findIndex(item => item.id === idNum);
      
      if (index !== -1) {
        dummyData.splice(index, 1);
      }
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting accommodation type:', error);
    return NextResponse.json(
      { error: 'Failed to delete accommodation type' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = params;
  const data = await request.json();
  
  try {
    try {
      // Try to update in database first
      const updateFields = Object.entries(data)
        .map(([key, _]) => `${key} = ?`)
        .join(', ');
      
      const values = [...Object.values(data), id];
      
      await db.query(
        `UPDATE accommodation_types SET ${updateFields} WHERE id = ?`, 
        values
      );
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error updating in database:', error);
      
      // For dummy data, find and update the item
      const idNum = parseInt(id);
      const index = dummyData.findIndex(item => item.id === idNum);
      
      if (index !== -1) {
        dummyData[index] = { ...dummyData[index], ...data } as AccommodationType;
      }
      
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating accommodation type:', error);
    return NextResponse.json(
      { error: 'Failed to update accommodation type' },
      { status: 500 }
    );
  }
} 