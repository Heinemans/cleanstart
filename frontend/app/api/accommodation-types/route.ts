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

export async function GET() {
  try {
    // Check if table exists
    try {
      const [rows] = await db.query<AccommodationTypeRow[]>(
        'SELECT id, name, active, created_at FROM accommodation_types ORDER BY name ASC'
      );
      return NextResponse.json(rows);
    } catch (error) {
      // If table doesn't exist, return the persistent dummy data
      console.error('Error querying accommodation_types table:', error);
      return NextResponse.json(dummyData);
    }
  } catch (error) {
    console.error('Error fetching accommodation types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch accommodation types' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    try {
      // Try to insert into database
      const result = await db.query(
        'INSERT INTO accommodation_types (name, active) VALUES (?, ?)',
        [data.name, data.active ?? true]
      );
      
      // @ts-ignore
      const id = result[0].insertId;
      return NextResponse.json({ id, ...data });
    } catch (error) {
      console.error('Error inserting into database:', error);
      
      // For dummy data, create a new entry with the next available ID
      const newId = Math.max(...dummyData.map(item => item.id)) + 1;
      const newItem: AccommodationType = {
        id: newId,
        name: data.name,
        active: data.active ?? true,
        created_at: new Date().toISOString()
      };
      
      dummyData.push(newItem);
      return NextResponse.json(newItem);
    }
  } catch (error) {
    console.error('Error creating accommodation type:', error);
    return NextResponse.json(
      { error: 'Failed to create accommodation type' },
      { status: 500 }
    );
  }
} 