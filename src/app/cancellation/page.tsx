import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Phone, CalendarX } from 'lucide-react';

export const metadata = {
  title: 'Cancellation Policy | Thendral Day Out',
  description: 'Cancellation and rescheduling policy for Thendral Day Out full-day venue reservations.',
};

export default function CancellationPage() {
  return (
    <main>
      <Header />
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--primary-blue)',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '40px 32px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-booked-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CalendarX size={24} color="#dc2626" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  Cancellation & Rescheduling Policy
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Clear and direct guidance for date changes
                </p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p>
                Because <strong>THENDRAL DAY OUT</strong> operates as an exclusive single-booking private destination (where only one family/friends group reserves the entire venue for an entire day), blocked dates directly prevent other guests from booking.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                How to Request a Cancellation or Date Change
              </h2>
              <p>
                If an unforeseen emergency requires you to reschedule or cancel your confirmed date, please contact our management team directly at the earliest opportunity:
              </p>
              <div style={{
                padding: '16px 20px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '14px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <Phone size={20} color="var(--primary-blue)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--primary-blue-dark)' }}>Direct Management Line</div>
                  <a href="tel:8778038383" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    8778038383
                  </a>
                </div>
              </div>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                Administrative Review
              </h2>
              <p>
                All cancellation and rescheduling requests are handled on a case-by-case basis by the business administration. Once a cancellation is processed by the admin, the date is freed on the public availability calendar for other guests.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
