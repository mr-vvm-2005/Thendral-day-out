import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = readDb();
    
    // Extract only the dates for confirmed and pending bookings.
    // Crucial: NEVER leak customer names, phone numbers, booking IDs, or amounts in public availability
    const bookedDates = db.bookings
      .filter((b) => b.booking_status === 'CONFIRMED')
      .map((b) => b.booking_date);

    const pendingDates = db.bookings
      .filter((b) => b.booking_status === 'PENDING')
      .map((b) => b.booking_date);

    return NextResponse.json({
      success: true,
      bookedDates,
      pendingDates,
      price: db.settings.price || 3000,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to check availability at this time.' },
      { status: 500 }
    );
  }
}
