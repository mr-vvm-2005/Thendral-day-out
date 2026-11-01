import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Thendral Day Out',
  description: 'Booking terms, property guidelines, and visitor policies for Thendral Day Out.',
};

export default function TermsPage() {
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
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginBottom: '8px' }}>
              Terms & Conditions
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Applicable to all private venue reservations
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                1. Nature of Booking
              </h2>
              <p>
                Thendral Day Out is booked as an entire private venue for a full day. One confirmed booking gives your family and friends exclusive access to the property for the date booked.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                2. Pricing and Confirmation
              </h2>
              <p>
                The standard rate is <strong>₹3,000 / Full Day</strong>. Bookings are confirmed upon successful payment verification via UPI with our management team. A digital booking ticket is then issued.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                3. Food & Beverages Policy
              </h2>
              <p>
                Guests are welcome to bring their own prepared meals, snacks, and beverages. The venue does not provide in-house food, restaurant, or live cooking services.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                4. Safety and Care of Property
              </h2>
              <p>
                Guests agree to use the facilities safely and responsibly. Adults must supervise children at all times in the swimming pools and playground. Any damages to venue infrastructure or fixtures will be assessed to the booking organizer.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                5. Questions
              </h2>
              <p>
                For any clarifications regarding your booking terms, call <strong>8778038383</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
