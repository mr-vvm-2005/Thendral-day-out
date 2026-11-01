import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
      return NextResponse.json({ success: false, error: 'Booking ID is required.' }, { status: 400 });
    }

    const db = readDb();
    const booking = db.bookings.find(
      (b) => b.booking_id.toLowerCase() === bookingId.trim().toLowerCase()
    );

    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    // Host domain verification URL
    const host = req.headers.get('host') || 'localhost:3000';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const verifyUrl = `${proto}://${host}/verify/${booking.booking_id}`;

    // Generate QR Code data URL securely
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0B4F8A',
        light: '#FFFFFF',
      },
    });

    return NextResponse.json({
      success: true,
      ticket: {
        booking_id: booking.booking_id,
        customer_name: booking.customer_name,
        booking_date: booking.booking_date,
        booking_type: booking.booking_type,
        amount: booking.amount,
        payment_status: booking.payment_status,
        payment_method: booking.payment_method,
        payment_reference: booking.payment_reference || 'UPI Verified',
        booking_status: booking.booking_status,
        notes: booking.notes,
        created_at: booking.created_at,
        venue: {
          business_name: db.settings.business_name,
          parent_brand: db.settings.parent_brand,
          tagline: db.settings.tagline,
          location: db.settings.location,
          phone: db.settings.phone,
          check_in_time: db.settings.check_in_time,
          check_out_time: db.settings.check_out_time,
        },
        facilities: [
          'Swimming Pools (Adults & Kids)',
          'Artificial Falls',
          'Kids Play Area',
          'Birthday Party Hall',
          'Green Garden Area',
          'Dedicated Dining Space',
          'Dressing Rooms & Restrooms',
        ],
        qr_code: qrCodeDataUrl,
        verify_url: verifyUrl,
      },
    });
  } catch (error) {
    console.error('Error retrieving ticket:', error);
    return NextResponse.json({ success: false, error: 'Unable to retrieve ticket.' }, { status: 500 });
  }
}
