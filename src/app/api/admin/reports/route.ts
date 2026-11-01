import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format');

  const db = readDb();
  const bookings = db.bookings;
  const customers = db.customers;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = todayStr.slice(0, 7); // YYYY-MM

  // Metrics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.booking_status === 'CONFIRMED');
  const pendingBookings = bookings.filter((b) => b.booking_status === 'PENDING');
  const cancelledBookings = bookings.filter((b) => b.booking_status === 'CANCELLED');

  // Confirmed Revenue = Confirmed paid bookings × ₹3,000 (DO NOT count cancelled)
  const confirmedPaidBookings = confirmedBookings.filter((b) => b.payment_status === 'PAID');
  const confirmedRevenue = confirmedPaidBookings.reduce((sum, b) => sum + (b.amount || 3000), 0);

  // This month bookings
  const thisMonthBookings = bookings.filter((b) => b.booking_date.startsWith(currentMonthStr));
  const thisMonthRevenue = thisMonthBookings
    .filter((b) => b.booking_status === 'CONFIRMED' && b.payment_status === 'PAID')
    .reduce((sum, b) => sum + (b.amount || 3000), 0);

  // Upcoming bookings
  const upcomingBookings = bookings.filter(
    (b) => b.booking_date >= todayStr && b.booking_status === 'CONFIRMED'
  );

  // Today's booking
  const todaysBooking = bookings.find(
    (b) => b.booking_date === todayStr && b.booking_status === 'CONFIRMED'
  ) || null;

  // Monthly breakdown
  const monthlyMap: Record<string, { month: string; confirmed: number; revenue: number; cancelled: number }> = {};
  for (const b of bookings) {
    const m = b.booking_date.slice(0, 7);
    if (!monthlyMap[m]) {
      monthlyMap[m] = { month: m, confirmed: 0, revenue: 0, cancelled: 0 };
    }
    if (b.booking_status === 'CONFIRMED' && b.payment_status === 'PAID') {
      monthlyMap[m].confirmed += 1;
      monthlyMap[m].revenue += b.amount || 3000;
    } else if (b.booking_status === 'CANCELLED') {
      monthlyMap[m].cancelled += 1;
    }
  }

  // Customer metrics
  const repeatCustomers = customers.filter((c) => c.total_bookings > 1).length;
  const newCustomers = customers.length - repeatCustomers;

  // Handle CSV export
  if (format === 'csv') {
    let csv = 'Booking ID,Customer Name,Phone,Date,Type,Amount,Payment Status,Booking Status,Created At\n';
    for (const b of bookings) {
      csv += `"${b.booking_id}","${b.customer_name}","${b.customer_phone}","${b.booking_date}","${b.booking_type}",${b.amount},"${b.payment_status}","${b.booking_status}","${b.created_at}"\n`;
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="thendral_day_out_report_${todayStr}.csv"`,
      },
    });
  }

  return NextResponse.json({
    success: true,
    overview: {
      totalBookings,
      confirmedCount: confirmedBookings.length,
      pendingCount: pendingBookings.length,
      cancelledCount: cancelledBookings.length,
      confirmedRevenue,
      thisMonthBookingsCount: thisMonthBookings.length,
      thisMonthRevenue,
      upcomingCount: upcomingBookings.length,
      todaysBooking,
      newCustomers,
      repeatCustomers,
    },
    monthlyBreakdown: Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month)),
  });
}
