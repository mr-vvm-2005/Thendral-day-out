'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, CheckCircle2, XCircle, Calendar, MapPin, Phone, ArrowLeft } from 'lucide-react';

export default function VerifyPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verify() {
      try {
        setLoading(true);
        const res = await fetch(`/api/ticket?id=${bookingId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || 'Invalid or unverified booking ticket.');
        } else {
          setBooking(data.ticket);
        }
      } catch {
        setError('Verification service unavailable.');
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) {
      verify();
    }
  }, [bookingId]);

  return (
    <div style={{
      backgroundColor: 'var(--bg-main)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
      }}>
        {/* Brand Bar */}
        <div style={{
          backgroundColor: 'var(--primary-blue-dark)',
          color: '#ffffff',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            position: 'relative',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            padding: '2px',
            overflow: 'hidden',
          }}>
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#86efac', textTransform: 'uppercase' }}>
              Thendral Groups Verification Portal
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.2rem', fontWeight: 800 }}>
              THENDRAL DAY OUT
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
                Verifying booking reference...
              </div>
            </div>
          ) : error || !booking ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-booked-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}>
                <XCircle size={36} color="#dc2626" />
              </div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
                Invalid or Unverified Ticket
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
                The reference <strong>{bookingId}</strong> could not be verified in the official Thendral Day Out database.
              </p>
              <Link href="/" className="btn btn-primary btn-sm">
                Return to Homepage
              </Link>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-green-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  border: '2px solid rgba(34, 197, 94, 0.4)',
                }}>
                  <ShieldCheck size={40} color="var(--accent-green)" />
                </div>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}>
                  ✓ Verified Authentic Booking
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  {booking.booking_id}
                </h1>
              </div>

              {/* Verified Details Card */}
              <div style={{
                backgroundColor: 'var(--bg-main)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Customer Name</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>{booking.customer_name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reserved Date</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-green)' }}>{booking.booking_date} (Full Day)</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Booking Status</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: booking.booking_status === 'CONFIRMED' ? '#15803d' : '#d97706' }}>
                    {booking.booking_status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Amount Paid</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                    ₹{booking.amount.toLocaleString()} ({booking.payment_status})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Access</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    09:00 AM – 06:00 PM (Exclusive)
                  </span>
                </div>
              </div>

              {/* Venue details */}
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>
                📍 {booking.venue?.location}<br />
                📞 {booking.venue?.phone}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href={`/ticket/${booking.booking_id}`}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  View Full Digital Ticket
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
