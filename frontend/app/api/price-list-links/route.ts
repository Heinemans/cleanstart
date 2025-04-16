import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        pll.*,
        pc.code as price_code_code,
        pc.label as price_code_name,
        pl.name as price_list_name,
        pl.valid_from as price_list_valid_from,
        pl.valid_until as price_list_valid_until
      FROM 
        price_list_links pll
      JOIN 
        price_codes pc ON pll.price_code_id = pc.id
      JOIN 
        price_lists pl ON pll.price_list_id = pl.id
      ORDER BY 
        pc.code ASC, pl.valid_from DESC
    `);
    
    // Parse the JSON field
    const formattedRows = (rows as RowDataPacket[]).map((row: any) => ({
      ...row,
      daily_prices: typeof row.daily_prices === 'string' 
        ? JSON.parse(row.daily_prices) 
        : row.daily_prices,
      active: !!row.active,
    }));
    
    return NextResponse.json(formattedRows);
  } catch (error) {
    console.error('Error fetching price list links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price list links' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { price_code_id, price_list_id, daily_prices, price_extra_day, active } = await req.json();

    // Validation
    if (!price_code_id || !price_list_id || !daily_prices || daily_prices.length !== 14 || price_extra_day === undefined) {
      return NextResponse.json(
        { error: 'All fields are required. Daily prices must contain 14 values.' },
        { status: 400 }
      );
    }

    // Check if link already exists
    const [existing] = await db.query(
      'SELECT * FROM price_list_links WHERE price_code_id = ? AND price_list_id = ?',
      [price_code_id, price_list_id]
    );

    if ((existing as RowDataPacket[]).length > 0) {
      return NextResponse.json(
        { error: 'A link between this price code and price list already exists' },
        { status: 400 }
      );
    }

    // Insert the new price list link
    const [result] = await db.query(
      `INSERT INTO price_list_links 
       (price_code_id, price_list_id, daily_prices, price_extra_day, active) 
       VALUES (?, ?, ?, ?, ?)`,
      [price_code_id, price_list_id, JSON.stringify(daily_prices), price_extra_day, active ?? true]
    );

    const insertId = (result as any).insertId;

    // Get the newly created price list link
    const [newLink] = await db.query(`
      SELECT 
        pll.*,
        pc.code as price_code_code,
        pc.label as price_code_name,
        pl.name as price_list_name,
        pl.valid_from as price_list_valid_from,
        pl.valid_until as price_list_valid_until
      FROM 
        price_list_links pll
      JOIN 
        price_codes pc ON pll.price_code_id = pc.id
      JOIN 
        price_lists pl ON pll.price_list_id = pl.id
      WHERE 
        pll.id = ?
    `, [insertId]);

    // Format the response
    const formattedLink = {
      ...((newLink as RowDataPacket[])[0] as any),
      daily_prices: JSON.parse(((newLink as RowDataPacket[])[0] as any).daily_prices),
      active: !!((newLink as RowDataPacket[])[0] as any).active,
    };

    return NextResponse.json(formattedLink, { status: 201 });
  } catch (error) {
    console.error('Error creating price list link:', error);
    return NextResponse.json(
      { error: 'Failed to create price list link' },
      { status: 500 }
    );
  }
} 