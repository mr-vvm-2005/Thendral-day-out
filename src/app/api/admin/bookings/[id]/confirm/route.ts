import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb, writeDb, isDateAvailable } from '@/lib/db';

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
    const body = await req.json().catch(() => ({}));
    const { payment_reference = 'UPI Confirmed by Admin' } = body;

    const db = readDb();
    const booking = db.bookings.find((b) => b.id === id || b.booking_id === id);

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    // Check availability
    if (!isDateAvailable(booking.booking_date, booking.id)) {
      return NextResponse.json(
        { success: false, error: 'This date already has another confirmed booking.' },
        { status: 409 }
      );
    }

    booking.booking_status = 'CONFIRMED';
    booking.payment_status = 'PAID';
    booking.payment_reference = payment_reference;
    booking.updated_at = new Date().toISOString();

    // Update customer stats
    const customer = db.customers.find((c) => c.id === booking.customer_id);
    if (customer) {
      customer.total_bookings += 1;
      customer.total_spent += booking.amount;
      customer.updated_at = new Date().toISOString();
    }

    writeDb(db);

    return NextResponse.json({
      success: true,
      booking,
      message: `Booking ${booking.booking_id} confirmed and ticket activated.`,
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json({ success: false, error: 'Failed to confirm booking.' }, { status: 500 });
  }
}
