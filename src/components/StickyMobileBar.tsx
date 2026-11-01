'use client';

import React from 'react';
import { CalendarSearch, CalendarCheck, Phone, MessageCircle } from 'lucide-react';

interface StickyMobileBarProps {
  onCheckAvailability: () => void;
  onBookNow: () => void;
}

export default function StickyMobileBar({ onCheckAvailability, onBookNow }: StickyMobileBarProps) {
  const whatsappUrl =
    'https://wa.me/918778038383?text=' +
    encodeURIComponent('Hello Thendral Day Out, I would like to enquire about a private full-day booking.');

  return (
    <div
      className="mobile-sticky-bar"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-light)',
        padding: '8px clamp(6px, 2vw, 12px)',
        boxShadow: '0 -4px 16px rgba(12, 74, 110, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'clamp(4px, 1.5vw, 8px)',
      }}
    >
      <a
        href="tel:8778038383"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 10px',
          color: 'var(--primary-blue)',
          fontSize: '0.74rem',
          fontWeight: 800,
          fontFamily: 'Fredoka, sans-serif',
          borderRadius: '10px',
          flex: '0 0 auto',
        }}
        aria-label="Call 8778038383"
      >
        <Phone size={19} />
        <span>CALL</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 10px',
          color: '#16a34a',
          fontSize: '0.74rem',
          fontWeight: 800,
          fontFamily: 'Fredoka, sans-serif',
          borderRadius: '10px',
          flex: '0 0 auto',
        }}
        aria-label="WhatsApp"
      >
        <MessageCircle size={19} />
        <span>WHATSAPP</span>
      </a>

      <button
        onClick={onCheckAvailability}
        style={{
          flex: '1 1 auto',
          backgroundColor: '#ffffff',
          color: 'var(--primary-blue)',
          border: '2px solid var(--primary-blue)',
          borderRadius: 'var(--radius-full)',
          padding: '10px 12px',
          fontSize: '0.82rem',
          fontWeight: 800,
          fontFamily: 'Fredoka, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
      >
        <CalendarSearch size={15} />
        <span>CHECK DATES</span>
      </button>

      <button
        onClick={onBookNow}
        style={{
          flex: '1 1 auto',
          background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
          color: '#ffffff',
          borderRadius: 'var(--radius-full)',
          padding: '10px 14px',
          fontSize: '0.85rem',
          fontWeight: 800,
          fontFamily: 'Fredoka, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 3px 12px rgba(22, 163, 74, 0.4)',
        }}
      >
        <CalendarCheck size={16} />
        <span>BOOK ₹3K</span>
      </button>

      <style jsx>{`
        @media (min-width: 1024px) {
          .mobile-sticky-bar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
