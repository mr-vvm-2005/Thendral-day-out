import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = readDb();
    const booking = db.bookings.find((b) => b.id === id || b.booking_id === id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    // Update status to Cancelled (persisted, not deleted)
    const prevStatus = booking.booking_status;
    booking.booking_status = 'CANCELLED';
    booking.updated_at = new Date().toISOString();

    // Deduct from customer spend if was paid and confirmed
    if (prevStatus === 'CONFIRMED' && booking.payment_status === 'PAID') {
      const customer = db.customers.find((c) => c.id === booking.customer_id);
      if (customer) {
        customer.total_spent = Math.max(0, customer.total_spent - booking.amount);
        customer.updated_at = new Date().toISOString();
      }
    }

    writeDb(db);

    return NextResponse.json({
      success: true,
      booking,
      message: `Booking ${booking.booking_id} has been cancelled. The date ${booking.booking_date} is now available again.`,
    });
  } catch (error) {
    console.error('Cancellation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to cancel booking.' }, { status: 500 });
  }
}
