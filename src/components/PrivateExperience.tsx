'use client';

import React from 'react';
import { CalendarSearch, Check, Lock, Sparkles, HeartHandshake, Waves, Flame } from 'lucide-react';

interface PrivateExperienceProps {
  onCheckDate: () => void;
}

export default function PrivateExperience({ onCheckDate }: PrivateExperienceProps) {
  const perks = [
    'Private booking — No strangers sharing your venue',
    'Full-day access from morning till evening',
    'Adult swimming pool with waterfall cascade',
    'Dedicated safe kids pool and playground slide',
    'Peaceful tropical garden & relaxation spaces',
    'Covered celebration party hall with ceiling fans',
    'Open-air dry dining benches under coconut palms',
  ];

  return (
    <section id="experience" className="section-padding" style={{
      background: 'linear-gradient(135deg, #0284c7 0%, #0c4a6e 100%)',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Wave Divider at Top */}
      <div className="wave-divider" style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" fill="#f8fafc">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '30px' }}>
        <div style={{
          maxWidth: '920px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          {/* Fun Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-full)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            fontSize: '0.95rem',
            fontWeight: 800,
            fontFamily: 'Fredoka, sans-serif',
            color: '#fef08a',
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            <Lock size={17} />
            <span>100% Exclusive Reservation</span>
          </div>

          <h2 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(2.4rem, 6vw, 4.4rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '18px',
            letterSpacing: '-0.01em',
            textShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}>
            THE WHOLE PLACE. JUST FOR YOUR GROUP.
          </h2>

          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
            fontWeight: 600,
            color: '#e0f2fe',
            marginBottom: '36px',
            lineHeight: 1.45,
          }}>
            Book one date and enjoy the entire venue exclusively with your family and friends. No crowds. No sharing. Just pure holiday joy!
          </p>

          {/* Perks Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            maxWidth: '820px',
            margin: '0 auto 40px auto',
            textAlign: 'left',
          }}>
            {perks.map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#86efac',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#15803d',
                }}>
                  <Check size={16} strokeWidth={3} />
                </div>
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* Big Colorful Price Pill */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#ffffff',
            padding: '24px 44px',
            borderRadius: '32px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            border: '4px solid #f59e0b',
            marginBottom: '36px',
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: 'Fredoka, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
            }}>
              <Flame size={14} />
              <span>OFFER IS GOING ON NOW • BOOK NOW!</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}>
              {/* Crossed out ₹5,000 */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  textDecorationColor: '#ef4444',
                  textDecorationThickness: '3px',
                }}>
                  ₹5,000
                </span>
                <span style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontFamily: 'Fredoka, sans-serif',
                }}>
                  40% OFF
                </span>
              </div>

              {/* Offer price ₹3,000 */}
              <div style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: 'clamp(2.8rem, 6.5vw, 4.4rem)',
                fontWeight: 800,
                color: '#15803d',
                lineHeight: 1,
              }}>
                ₹3,000 <span style={{ fontSize: '1.5rem', color: '#0284c7', fontWeight: 700 }}>/ FULL DAY</span>
              </div>
            </div>

            <div style={{
              fontSize: '0.92rem',
              color: '#64748b',
              marginTop: '10px',
              fontWeight: 600,
            }}>
              One flat fee for your entire family & friends group • Entire private venue exclusively for you
            </div>
          </div>

          <div>
            <button
              onClick={onCheckDate}
              className="btn btn-sunny btn-lg"
              style={{
                fontSize: '1.25rem',
                padding: '20px 48px',
              }}
            >
              <CalendarSearch size={26} />
              <span>CHECK YOUR DATE AVAILABILITY</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
