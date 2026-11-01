import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(
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
    const bookingIndex = db.bookings.findIndex((b) => b.id === id || b.booking_id === id);

    if (bookingIndex === -1) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    const [deletedBooking] = db.bookings.splice(bookingIndex, 1);

    // Adjust customer stats if customer exists
    if (deletedBooking.customer_id) {
      const customer = db.customers.find((c) => c.id === deletedBooking.customer_id);
      if (customer) {
        customer.total_bookings = Math.max(0, (customer.total_bookings || 1) - 1);
        if (deletedBooking.booking_status === 'CONFIRMED' && deletedBooking.payment_status === 'PAID') {
          customer.total_spent = Math.max(0, (customer.total_spent || deletedBooking.amount) - deletedBooking.amount);
        }
        customer.updated_at = new Date().toISOString();
      }
    }

    writeDb(db);

    return NextResponse.json({
      success: true,
      deletedBooking,
      message: `Booking ${deletedBooking.booking_id} (${deletedBooking.customer_name} - ${deletedBooking.booking_date}) has been deleted.`,
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete booking.' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  return DELETE(req, props);
}

