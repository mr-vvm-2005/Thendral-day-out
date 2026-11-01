'use client';

import React from 'react';
import { CalendarSearch, CalendarCheck, Navigation, Phone, MapPin, MessageCircle, Sparkles } from 'lucide-react';

interface FinalCTAProps {
  onCheckAvailability: () => void;
  onBookNow: () => void;
}

export default function FinalCTA({ onCheckAvailability, onBookNow }: FinalCTAProps) {
  const googleMapsUrl = 'https://maps.app.goo.gl/SoSykGNBFHepynWr9';
  const whatsappUrl =
    'https://wa.me/918778038383?text=' +
    encodeURIComponent('Hello Thendral Day Out, I am ready to book the venue for a private full day. Please check availability for my date.');

  return (
    <section className="section-padding" style={{
      background: 'linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)',
      color: '#ffffff',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative Wave Divider at Top */}
      <div className="wave-divider" style={{ position: 'absolute', top: 0, left: 0, right: 0, transform: 'rotate(180deg)' }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" fill="#ffffff">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '30px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="fun-eyebrow" style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#fde68a', borderColor: 'rgba(255,255,255,0.3)' }}>
            <Sparkles size={16} />
            <span>Ready For Holiday Fun?</span>
          </div>

          <h2 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(2.5rem, 6.5vw, 4.4rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '14px',
            textShadow: '0 4px 18px rgba(0,0,0,0.3)',
          }}>
            READY FOR YOUR DAY OUT?
          </h2>

          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
            fontWeight: 700,
            color: '#86efac',
            marginBottom: '8px',
            fontFamily: 'Fredoka, sans-serif',
            letterSpacing: '0.02em',
          }}>
            Swim. Play. Celebrate. Make Memories.
          </p>

          {/* Offer Banner */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '6px 18px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.9rem',
            fontWeight: 800,
            fontFamily: 'Fredoka, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '14px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          }}>
            <span>🔥 SPECIAL OFFER IS GOING ON NOW • BOOK NOW!</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
              fontWeight: 700,
              color: '#cbd5e1',
              fontFamily: 'Fredoka, sans-serif',
              textDecoration: 'line-through',
              textDecorationColor: '#f87171',
              textDecorationThickness: '3px',
            }}>
              ₹5,000
            </span>
            <span style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 3.2rem)',
              fontWeight: 800,
              color: '#fef08a',
              fontFamily: 'Fredoka, sans-serif',
              lineHeight: 1,
            }}>
              ₹3,000
            </span>
            <span style={{
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 700,
              color: '#86efac',
              fontFamily: 'Fredoka, sans-serif',
              textTransform: 'uppercase',
            }}>
              / FULL DAY
            </span>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '8px',
              fontFamily: 'Fredoka, sans-serif',
            }}>
              SAVE ₹2,000 (40% OFF)
            </span>
          </div>

          <p style={{
            fontSize: '1.05rem',
            color: '#e0f2fe',
            marginBottom: '36px',
            maxWidth: '680px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Book the entire place for your family and friends. Swimming pools, waterfall, playground, party hall, and garden all exclusively to yourselves!
          </p>

          {/* 3 Primary Action Buttons (Section 61) */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '36px',
          }}>
            <button
              onClick={onCheckAvailability}
              className="btn btn-sunny btn-lg"
              style={{
                flex: '1 1 220px',
                maxWidth: '280px',
              }}
            >
              <CalendarSearch size={22} />
              <span>CHECK AVAILABILITY</span>
            </button>

            <button
              onClick={onBookNow}
              className="btn btn-primary btn-lg"
              style={{
                flex: '1 1 220px',
                maxWidth: '280px',
              }}
            >
              <CalendarCheck size={22} />
              <span>BOOK NOW</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
              style={{
                flex: '1 1 220px',
                maxWidth: '280px',
                backgroundColor: '#ffffff',
                color: 'var(--primary-blue-dark)',
              }}
            >
              <Navigation size={22} color="var(--primary-blue)" />
              <span>GET DIRECTIONS</span>
            </a>
          </div>

          {/* Contact Details */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '1.15rem',
            fontWeight: 700,
            fontFamily: 'Fredoka, sans-serif',
          }}>
            <a
              href="tel:8778038383"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <Phone size={22} color="#38bdf8" />
              <span>📞 8778038383</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#86efac',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={22} color="#86efac" />
              <span>💬 WhatsApp Us</span>
            </a>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#fef08a',
            }}>
              <MapPin size={22} color="#fef08a" />
              <span>📍 Panpoli, Tenkasi</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
