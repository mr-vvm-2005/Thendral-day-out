'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, ShieldCheck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#071d2f',
      color: '#cbd5e1',
      paddingTop: '64px',
      paddingBottom: '32px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                position: 'relative',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                padding: '4px',
              }}>
                <Image
                  src="/images/logo.png"
                  alt="Thendral Day Out"
                  width={48}
                  height={48}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <h3 style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.1,
                }}>
                  THENDRAL DAY OUT
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 600, textTransform: 'uppercase' }}>
                  by Thendral Groups
                </span>
              </div>
            </div>

            <p style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fef08a',
              marginBottom: '16px',
            }}>
              Swim • Play • Celebrate • Make Memories
            </p>

            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              A private full-day family recreation and celebration destination in Panpoli, Tenkasi. Entire venue exclusively reserved for your booking.
            </p>
          </div>

          {/* Quick Links (Section 54) */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '18px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Home</Link>
              </li>
              <li>
                <a href="#facilities" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Facilities</a>
              </li>
              <li>
                <a href="#gallery" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Gallery</a>
              </li>
              <li>
                <a href="#availability" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Availability</a>
              </li>
              <li>
                <a href="#availability" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Booking</a>
              </li>
              <li>
                <a href="#faq" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>FAQ</a>
              </li>
              <li>
                <a href="#location" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Contact</a>
              </li>
              <li>
                <Link href="/rules" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Rules & Guidelines</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '18px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Contact & Location
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>
                  Near Panpoli Thaika Bus Stop,<br />
                  Panpoli, Tenkasi, Tamil Nadu
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#86efac" style={{ flexShrink: 0 }} />
                <a href="tel:8778038383" style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.05rem' }}>
                  8778038383
                </a>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '18px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Policies & Info
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/privacy" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/cancellation" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>Cancellation Policy</Link>
              </li>
              <li style={{ marginTop: '10px' }}>
                <Link
                  href="/admin/login"
                  style={{
                    color: '#64748b',
                    fontSize: '0.8rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Lock size={12} />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and Designer Credit */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          textAlign: 'center',
          fontSize: '0.88rem',
          color: '#94a3b8',
        }}>
          <div>
            © 2026 Thendral Day Out. All rights reserved.
          </div>
          <div>
            Website designed by{' '}
            <a
              href="https://site-studio-in.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#38bdf8',
                fontWeight: 700,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              MR.VVM
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
