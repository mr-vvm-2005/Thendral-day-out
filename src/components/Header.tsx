'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MessageCircle, Menu, X, CalendarCheck, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  onOpenBooking?: () => void;
}

export default function Header({ onOpenBooking }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '#about' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Availability', href: '#availability' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#location' },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
      boxShadow: '0 4px 16px rgba(12, 74, 110, 0.05)',
    }}>
      {/* Top micro announcement bar */}
      <div style={{
        background: 'linear-gradient(90deg, #dc2626 0%, #0369a1 100%)',
        color: '#ffffff',
        padding: '6px 12px',
        textAlign: 'center',
        fontSize: '0.82rem',
        fontWeight: 700,
        fontFamily: 'Fredoka, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        letterSpacing: '0.03em',
      }}>
        <span>🔥 SPECIAL OFFER IS GOING ON NOW: <s style={{ opacity: 0.8, textDecorationColor: '#fecaca', margin: '0 4px' }}>₹5,000</s> <strong style={{ color: '#fef08a', fontSize: '0.92rem' }}>₹3,000 / FULL DAY</strong> — BOOK NOW!</span>
        <span style={{ opacity: 0.7 }}>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#fde68a' }}>
          <MapPin size={13} /> Panpoli, Tenkasi
        </span>
      </div>

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '84px',
      }}>
        {/* Brand Hierarchy: THENDRAL DAY OUT / by Thendral Groups (Logo click opens Admin Portal) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            href="/admin"
            title="Admin Portal (Click to open)"
            style={{
              position: 'relative',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '2px solid var(--border-playful)',
              boxShadow: 'var(--shadow-sm)',
              backgroundColor: '#ffffff',
              padding: '3px',
              display: 'block',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Thendral Day Out Logo"
              width={56}
              height={56}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              fontFamily: 'Fredoka, Outfit, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.1rem, 3.8vw, 1.45rem)',
              color: 'var(--primary-blue-dark)',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}>
              THENDRAL DAY OUT
            </div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--accent-green)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              by THENDRAL GROUPS
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '20px',
        }} className="desktop-nav">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                padding: '6px 10px',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--primary-blue)';
                e.currentTarget.style.backgroundColor = 'var(--primary-blue-soft)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Quick Actions */}
        <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="desktop-actions">
          <a
            href="tel:8778038383"
            className="btn btn-outline btn-sm"
            aria-label="Call 8778038383"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <Phone size={15} color="var(--primary-blue)" />
            <span>8778038383</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="btn btn-primary btn-sm"
            aria-label="Book venue now"
            style={{ padding: '10px 22px', fontSize: '0.95rem' }}
          >
            <CalendarCheck size={17} />
            <span>BOOK NOW</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary-blue-soft)',
            color: 'var(--primary-blue-dark)',
            border: '1.5px solid var(--border-playful)',
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '3px solid var(--border-playful)',
          padding: '24px 20px',
          boxShadow: 'var(--shadow-lg)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-main)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href="tel:8778038383"
              className="btn btn-outline"
              style={{ width: '100%' }}
            >
              <Phone size={18} />
              <span>Call: 8778038383</span>
            </a>
            <a
              href="https://wa.me/918778038383?text=Hello%20Thendral%20Day%20Out%2C%20I%20would%20like%20to%20enquire%20about%20a%20private%20full-day%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ width: '100%' }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp Us</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBooking) onOpenBooking();
              }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <CalendarCheck size={20} />
              <span>Book Venue (₹3,000 / Day)</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
