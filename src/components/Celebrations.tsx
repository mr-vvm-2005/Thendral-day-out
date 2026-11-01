'use client';

import React from 'react';
import Image from 'next/image';
import { PartyPopper, Cake, Users, Waves, Sparkles, CalendarCheck } from 'lucide-react';

interface CelebrationsProps {
  onCheckAvailability: () => void;
}

export default function Celebrations({ onCheckAvailability }: CelebrationsProps) {
  const partyFeatures = [
    {
      icon: <Cake size={24} color="#d97706" />,
      title: 'Birthday Parties',
      desc: 'Cake cutting in the covered celebration hall with ceiling fans and plenty of space for family seating.',
    },
    {
      icon: <Waves size={24} color="#0284c7" />,
      title: 'Swimming & Splash',
      desc: 'Adult pool with artificial waterfall plus dedicated safe kids pool for hours of aquatic fun.',
    },
    {
      icon: <Users size={24} color="#059669" />,
      title: 'Family & Friends',
      desc: 'Bring all generations together under one private roof without rush, time limits, or public crowds.',
    },
    {
      icon: <Sparkles size={24} color="#d97706" />,
      title: 'Garden & Dining',
      desc: 'Dine outdoors in stone tables shaded by coconut trees with your own delicious home-prepared food.',
    },
  ];

  return (
    <section id="celebrations" className="section-padding" style={{
      backgroundColor: '#ffffff',
      position: 'relative',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '48px',
          alignItems: 'center',
        }}>
          {/* Text Content */}
          <div>
            <div className="fun-eyebrow">
              <PartyPopper size={16} />
              <span>Parties & Family Gatherings</span>
            </div>

            <h2 style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              color: 'var(--primary-blue-dark)',
              lineHeight: 1.15,
              marginBottom: '18px',
            }}>
              MAKE THEIR DAY EXTRA SPECIAL 🎉
            </h2>

            <p style={{
              fontSize: '1.12rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '28px',
            }}>
              Celebrate birthdays with swimming, games, food brought by your group and plenty of memories. Thendral Day Out provides the complete combination: a covered celebration hall, swimming pools, children playground, garden, and dining space.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}>
              {partyFeatures.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '18px',
                    borderRadius: '20px',
                    border: '1.5px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--primary-blue-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <h3 style={{
                      fontFamily: 'Fredoka, sans-serif',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--primary-blue-dark)',
                    }}>
                      {item.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              padding: '14px 20px',
              backgroundColor: '#fffbeb',
              border: '1.5px dashed #fde68a',
              borderRadius: '16px',
              fontSize: '0.9rem',
              color: '#92400e',
              marginBottom: '32px',
            }}>
              🎈 <strong>Self-Arranged Celebrations:</strong> Booking includes exclusive use of the party hall, pool, and facilities. Guests arrange their own birthday cake, food, and custom party decorations.
            </div>

            <button onClick={onCheckAvailability} className="btn btn-sunny btn-lg">
              <CalendarCheck size={24} />
              <span>PLAN YOUR CELEBRATION</span>
            </button>
          </div>

          {/* Photo Showcase */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '6px solid #ffffff',
              aspectRatio: '4/3',
              position: 'relative',
              backgroundColor: '#e2e8f0',
            }}>
              <Image
                src="/images/party-hall.jpg"
                alt="Thendral Day Out birthday party hall in Panpoli Tenkasi"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Floating Banner */}
            <div style={{
              position: 'absolute',
              bottom: '-16px',
              left: '16px',
              right: '16px',
              backgroundColor: '#ffffff',
              padding: '16px 24px',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-hover)',
              border: '1.5px solid var(--border-playful)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', fontFamily: 'Fredoka, sans-serif' }}>
                  Covered Party Hall
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-blue-dark)', fontFamily: 'Fredoka, sans-serif' }}>
                  Smooth Flooring & High Roof with Ceiling Fans
                </div>
              </div>
              <span style={{ fontSize: '1.8rem' }}>🎂</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
