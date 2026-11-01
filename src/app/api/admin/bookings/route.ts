import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminSession } from '@/lib/auth';
import { readDb, writeDb, generateBookingId, isDateAvailable } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  const db = readDb();
  let bookings = [...db.bookings].sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());

  if (status && status !== 'ALL') {
    bookings = bookings.filter((b) => b.booking_status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    bookings = bookings.filter(
      (b) =>
        b.booking_id.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_phone.includes(q) ||
        b.booking_date.includes(q)
    );
  }

  return NextResponse.json({ success: true, bookings });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      booking_date,
      booking_type = 'Private Full-Day Booking',
      amount = 3000,
      payment_status = 'PAID',
      payment_method = 'UPI',
      payment_reference,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !booking_date) {
      return NextResponse.json(
        { success: false, error: 'Name, mobile number, and booking date are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(customer_phone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    // Backend race condition check: is date already confirmed?
    if (!isDateAvailable(booking_date)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This date already has a confirmed booking. Please select another date.',
        },
        { status: 409 }
      );
    }

    const db = readDb();

    // Find or create customer
    let customer = db.customers.find((c) => c.phone === cleanPhone);
    if (!customer) {
      customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: customer_name.trim(),
        phone: cleanPhone,
        total_bookings: 1,
        total_spent: payment_status === 'PAID' ? Number(amount) : 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.customers.push(customer);
    } else {
      customer.name = customer_name.trim();
      customer.total_bookings += 1;
      if (payment_status === 'PAID') {
        customer.total_spent += Number(amount);
      }
      customer.updated_at = new Date().toISOString();
    }

    // Generate safe backend Booking ID
    const bookingId = generateBookingId(booking_date, db.bookings);
    const secureToken = crypto.randomBytes(24).toString('hex');

    const newBooking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      booking_id: bookingId,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      booking_date,
      booking_type,
      amount: Number(amount),
      payment_status: payment_status as any,
      payment_method: payment_method as any,
      payment_reference: payment_reference || 'Admin Entry - UPI',
      booking_status: 'CONFIRMED' as const,
      notes: notes ? String(notes).trim() : '',
      secure_token: secureToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.bookings.push(newBooking);
    writeDb(db);

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: `Booking ${newBooking.booking_id} created and confirmed successfully!`,
    });
  } catch (error) {
    console.error('Error creating admin booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking.' },
      { status: 500 }
    );
  }
}
