'use client';

import React, { useState } from 'react';
import { Sparkles, CalendarSearch, IndianRupee, Flame } from 'lucide-react';

interface QuickPriceCheckProps {
  onCheckDate: (date: string) => void;
  onOpenBooking: () => void;
}

export default function QuickPriceCheck({ onCheckDate, onOpenBooking }: QuickPriceCheckProps) {
  const [selectedDate, setSelectedDate] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      onCheckDate(selectedDate);
    } else {
      onOpenBooking();
    }
  };

  return (
    <section style={{
      backgroundColor: '#f0f9ff',
      paddingTop: '16px',
      paddingBottom: '20px',
      position: 'relative',
      zIndex: 10,
    }}>
      <div className="container">
        <div style={{
          backgroundColor: '#ffffff',
          border: '2.5px solid var(--border-playful)',
          borderRadius: '24px',
          padding: '18px 26px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '18px',
          boxShadow: 'var(--shadow-md)',
        }}>
          {/* Price badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: '#fee2e2',
              border: '2px solid #fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Flame size={28} color="#dc2626" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontFamily: 'Fredoka, sans-serif',
                  letterSpacing: '0.04em',
                }}>
                  OFFER IS GOING ON NOW!
                </span>
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  textDecorationColor: '#ef4444',
                  textDecorationThickness: '2.5px',
                }}>
                  ₹5,000
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                  ₹3,000
                </span>
                <span style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase' }}>
                  / FULL DAY
                </span>
                <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 700, backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                  40% OFF • BOOK NOW
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Private venue booking • Entire place exclusively reserved for your family & friends
              </div>
            </div>
          </div>

          {/* Quick Date Selector Form */}
          <form
            onSubmit={handleCheck}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
              flexGrow: 1,
              maxWidth: '520px',
              justifyContent: 'flex-end',
            }}
          >
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select date to check availability"
              style={{
                padding: '11px 16px',
                borderRadius: '14px',
                border: '2px solid var(--border-light)',
                fontSize: '0.95rem',
                outline: 'none',
                backgroundColor: '#ffffff',
                fontFamily: 'inherit',
                flex: '1 1 180px',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ padding: '12px 24px', fontSize: '0.98rem' }}
            >
              <CalendarSearch size={18} />
              <span>Check Availability</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
