import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { price_code_id, price_list_id, daily_prices, price_extra_day, active } = await req.json();

    // Validation
    if (price_code_id === undefined && price_list_id === undefined && !daily_prices && price_extra_day === undefined && active === undefined) {
      return NextResponse.json(
        { error: 'At least one field must be provided' },
        { status: 400 }
      );
    }

    // If daily_prices is provided, ensure it's an array of 14 values
    if (daily_prices && daily_prices.length !== 14) {
      return NextResponse.json(
        { error: 'Daily prices must contain 14 values' },
        { status: 400 }
      );
    }

    // Check if the record exists
    const [existing] = await db.query<RowDataPacket[]>(
      'SELECT * FROM price_list_links WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Price list link not found' },
        { status: 404 }
      );
    }

    // If changing price_code_id or price_list_id, check for duplicates
    if (price_code_id || price_list_id) {
      const newPriceCodeId = price_code_id || existing[0].price_code_id;
      const newPriceListId = price_list_id || existing[0].price_list_id;

      const [duplicate] = await db.query<RowDataPacket[]>(
        'SELECT * FROM price_list_links WHERE price_code_id = ? AND price_list_id = ? AND id != ?',
        [newPriceCodeId, newPriceListId, id]
      );

      if (duplicate.length > 0) {
        return NextResponse.json(
          { error: 'A link between this price code and price list already exists' },
          { status: 400 }
        );
      }
    }

    // Build the update query
    const updates: string[] = [];
    const values: any[] = [];

    if (price_code_id !== undefined) {
      updates.push('price_code_id = ?');
      values.push(price_code_id);
    }

    if (price_list_id !== undefined) {
      updates.push('price_list_id = ?');
      values.push(price_list_id);
    }

    if (daily_prices) {
      updates.push('daily_prices = ?');
      values.push(JSON.stringify(daily_prices));
    }

    if (price_extra_day !== undefined) {
      updates.push('price_extra_day = ?');
      values.push(price_extra_day);
    }

    if (active !== undefined) {
      updates.push('active = ?');
      values.push(active);
    }

    values.push(id);

    // Update the record
    await db.query(
      `UPDATE price_list_links SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get the updated record
    const [updated] = await db.query<RowDataPacket[]>(`
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
    `, [id]);

    if (updated.length === 0) {
      return NextResponse.json(
        { error: 'Price list link not found after update' },
        { status: 404 }
      );
    }

    // Format the response
    const formattedLink = {
      ...updated[0],
      daily_prices: typeof updated[0].daily_prices === 'string' 
        ? JSON.parse(updated[0].daily_prices) 
        : updated[0].daily_prices,
      active: !!updated[0].active,
    };

    return NextResponse.json(formattedLink);
  } catch (error) {
    console.error('Error updating price list link:', error);
    return NextResponse.json(
      { error: 'Failed to update price list link' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Check if the record exists
    const [existing] = await db.query<RowDataPacket[]>(
      'SELECT * FROM price_list_links WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Price list link not found' },
        { status: 404 }
      );
    }

    // Delete the record
    await db.query('DELETE FROM price_list_links WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting price list link:', error);
    return NextResponse.json(
      { error: 'Failed to delete price list link' },
      { status: 500 }
    );
  }
} 