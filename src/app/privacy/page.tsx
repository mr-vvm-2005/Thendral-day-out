import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Thendral Day Out',
  description: 'Data privacy principles and policies for Thendral Day Out customers and website visitors.',
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Last updated: October 2026
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              <p>
                At <strong>THENDRAL DAY OUT</strong> (by Thendral Groups), we respect and protect your privacy. This policy outlines how we handle customer information when checking availability and booking our private recreation venue.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)', marginTop: '10px' }}>
                1. Information We Collect
              </h2>
              <p>
                We collect only the minimal information strictly required to coordinate your private booking:
              </p>
              <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Your Full Name</li>
                <li>Your Contact Mobile Number (for booking confirmation & ticket sharing)</li>
                <li>Preferred Booking Date and optional event notes</li>
              </ul>
              <p>
                We do NOT collect credit card numbers, debit card numbers, UPI PINs, or sensitive banking passwords on our website.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)', marginTop: '10px' }}>
                2. How We Use Your Information
              </h2>
              <p>
                Your details are exclusively used to verify date availability, generate your official booking confirmation ticket, and communicate operational arrival details for your visit. We never sell, rent, or trade your personal information to third parties.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)', marginTop: '10px' }}>
                3. Calendar Privacy
              </h2>
              <p>
                Our public availability calendar only displays whether a date is Available or Booked. Public visitors can never see another customer&apos;s name, phone number, payment details, or booking identification.
              </p>

              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)', marginTop: '10px' }}>
                4. Contact Us
              </h2>
              <p>
                For questions regarding data privacy, reach out to us at <strong>8778038383</strong> or visit us at Near Panpoli Thaika Bus Stop, Panpoli, Tenkasi.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
