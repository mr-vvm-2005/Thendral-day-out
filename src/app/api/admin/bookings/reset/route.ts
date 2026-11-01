import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const db = readDb();
    const deletedCount = db.bookings ? db.bookings.length : 0;
    const deletedCustomersCount = db.customers ? db.customers.length : 0;

    // Reset all bookings to empty array
    db.bookings = [];

    // Reset customer list or reset their stats
    db.customers = [];

    writeDb(db);

    return NextResponse.json({
      success: true,
      deletedBookings: deletedCount,
      deletedCustomers: deletedCustomersCount,
      revenue: 0,
      message: `All ${deletedCount} booking(s) and history have been cleared. Confirmed revenue has been reset to ₹0.`,
    });
  } catch (error) {
    console.error('Error resetting bookings and revenue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset bookings.' },
      { status: 500 }
    );
  }
}

