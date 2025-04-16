import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1. Altijd nieuwe klant aanmaken
      const [customerResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO customers 
        (last_name, first_name, phone, email, address, postal_code, city) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          body.customer.last_name,
          body.customer.first_name || null,
          body.customer.phone || null,
          body.customer.email || null,
          body.customer.address || null,
          body.customer.postal_code || null,
          body.customer.city || null,
        ]
      );
      
      const customerId = customerResult.insertId;

      // 2. Rental aanmaken met klantkoppeling
      const [rentalResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO rentals 
        (customer_id, start_date, end_date, comments, payment_method, payment_status) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          body.rentalPeriod.startDate,
          body.rentalPeriod.endDate,
          body.comments || null,
          body.paymentMethod || null,
          "pending"
        ]
      );
      
      const rentalId = rentalResult.insertId;

      // 3. Rental items koppelen
      for (const item of body.rentalItems) {
        await connection.execute(
          `INSERT INTO rental_items 
          (rental_id, item_number, start_date, end_date, price, discount, total) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            rentalId,
            item.item_number,
            item.startDate,
            item.endDate,
            item.price,
            item.discount || 0,
            item.total
          ]
        );
      }

      // 4. Services toevoegen (optioneel)
      if (body.extraServices) {
        if (body.extraServices.baggage_transport) {
          await connection.execute(
            `INSERT INTO rental_services (rental_id, service_type) VALUES (?, ?)`,
            [rentalId, "baggage"]
          );
        }
        
        if (body.extraServices.pickup) {
          await connection.execute(
            `INSERT INTO rental_services (rental_id, service_type) VALUES (?, ?)`,
            [rentalId, "pickup"]
          );
        }
        
        if (body.extraServices.delivery) {
          await connection.execute(
            `INSERT INTO rental_services (rental_id, service_type) VALUES (?, ?)`,
            [rentalId, "delivery"]
          );
        }
      }

      // Commit transaction
      await connection.commit();
      
      // 5. Retourneer resultaat
      return NextResponse.json({ id: rentalId, status: "saved" });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error: unknown) {
    console.error("Fout bij opslaan verhuur:", error);
    const errorMessage = error instanceof Error ? error.message : "Onbekende fout";
    return NextResponse.json(
      { status: "error", message: errorMessage }, 
      { status: 500 }
    );
  }
} 