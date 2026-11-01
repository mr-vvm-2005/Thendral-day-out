import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb, writeDb, generateBookingId, isDateAvailable } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, date, message, honeypot } = body;

    // Honeypot anti-spam check
    if (honeypot) {
      return NextResponse.json({ success: false, error: 'Spam detected.' }, { status: 400 });
    }

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Please enter your full name.' }, { status: 400 });
    }

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ success: false, error: 'Please select a valid date.' }, { status: 400 });
    }

    // Date must be today or future
    const selectedDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return NextResponse.json({ success: false, error: 'Selected date cannot be in the past.' }, { status: 400 });
    }

    // Strict race-condition check: verify date is NOT confirmed
    if (!isDateAvailable(date)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This date is unavailable. Please select another date.',
        },
        { status: 409 }
      );
    }

    const db = readDb();

    // Check or create customer
    let customer = db.customers.find((c) => c.phone === cleanPhone);
    if (!customer) {
      customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: name.trim(),
        phone: cleanPhone,
        total_bookings: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.customers.push(customer);
    } else {
      customer.name = name.trim();
      customer.updated_at = new Date().toISOString();
    }

    // Generate unique safe Booking ID on the backend
    const bookingId = generateBookingId(date, db.bookings);
    const secureToken = crypto.randomBytes(24).toString('hex');

    const newBooking = {
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      booking_id: bookingId,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_phone: customer.phone,
      booking_date: date,
      booking_type: 'Private Full-Day Booking',
      amount: db.settings.price || 3000,
      payment_status: 'PENDING' as const,
      payment_method: 'UPI' as const,
      booking_status: 'PENDING' as const,
      notes: message ? String(message).trim().slice(0, 500) : '',
      secure_token: secureToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.bookings.push(newBooking);
    writeDb(db);

    return NextResponse.json({
      success: true,
      bookingId: newBooking.booking_id,
      date: newBooking.booking_date,
      amount: newBooking.amount,
      message: 'Your booking enquiry has been received. Please contact us via Call or WhatsApp to complete your UPI payment and receive your digital ticket.',
    });
  } catch (error) {
    console.error('Booking enquiry error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
