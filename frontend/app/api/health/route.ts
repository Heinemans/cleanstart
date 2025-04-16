import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Check database connection
    try {
      const [result] = await db.query('SELECT 1 as connection_test');
      return NextResponse.json({
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
        env: {
          db_host: process.env.NEXT_PUBLIC_DB_HOST || 'not set',
          db_name: process.env.NEXT_PUBLIC_DB_NAME || 'not set',
          node_env: process.env.NODE_ENV || 'not set'
        }
      });
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({
        status: 'error',
        database: 'disconnected',
        error: dbError instanceof Error ? dbError.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        env: {
          db_host: process.env.NEXT_PUBLIC_DB_HOST || 'not set',
          db_name: process.env.NEXT_PUBLIC_DB_NAME || 'not set',
          node_env: process.env.NODE_ENV || 'not set'
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 