import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const db = readDb();
  
  // Attach full booking history to each customer
  const enrichedCustomers = db.customers.map((c) => {
    const customerBookings = db.bookings.filter((b) => b.customer_id === c.id);
    const confirmedCount = customerBookings.filter((b) => b.booking_status === 'CONFIRMED').length;
    const cancelledCount = customerBookings.filter((b) => b.booking_status === 'CANCELLED').length;
    const pendingCount = customerBookings.filter((b) => b.booking_status === 'PENDING').length;
    
    // Revenue from paid confirmed bookings only
    const confirmedAmount = customerBookings
      .filter((b) => b.booking_status === 'CONFIRMED' && b.payment_status === 'PAID')
      .reduce((sum, b) => sum + (b.amount || 3000), 0);

    return {
      ...c,
      confirmed_bookings: confirmedCount,
      cancelled_bookings: cancelledCount,
      pending_bookings: pendingCount,
      total_confirmed_amount: confirmedAmount,
      bookings: customerBookings,
    };
  });

  return NextResponse.json({ success: true, customers: enrichedCustomers });
}
