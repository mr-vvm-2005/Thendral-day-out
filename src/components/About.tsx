'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Heart, CheckCircle2, ShieldCheck, Waves } from 'lucide-react';

export default function About() {
  const highlights = [
    'Private full-day booking exclusively for your family and friends',
    'Adult swimming pool with refreshing artificial waterfall feature',
    'Dedicated safe kids pool and outdoor play area with slide',
    'Spacious covered birthday party hall for special celebrations',
    'Lush tropical garden surrounded by scenic Panpoli coconut groves',
    'Dedicated dining area — guests welcome to bring prepared food',
  ];

  return (
    <section id="about" className="section-padding" style={{
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative ambient background accents */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '52px',
          alignItems: 'center',
        }}>
          {/* Visual Showcase with Fun Floating Elements */}
          <div style={{ position: 'relative' }}>
            {/* Playful Floating Badges */}
            <div style={{
              position: 'absolute',
              top: '-16px',
              left: '-12px',
              zIndex: 3,
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--border-playful)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'Fredoka, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: 'var(--primary-blue-dark)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>☀️</span> Sunny Tropical Day Out
            </div>

            <div style={{
              borderRadius: '32px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '6px solid #ffffff',
              position: 'relative',
              aspectRatio: '16/11',
              backgroundColor: '#e0f2fe',
            }}>
              <Image
                src="/images/venue-collage.jpg"
                alt="Thendral Day Out venue overview in Panpoli Tenkasi showing pool, play area, dining, and hall"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>

            {/* Floating Exclusive Card */}
            <div style={{
              position: 'absolute',
              bottom: '-24px',
              right: '-10px',
              backgroundColor: '#ffffff',
              padding: '18px 24px',
              borderRadius: '24px',
              boxShadow: 'var(--shadow-hover)',
              border: '1.5px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              zIndex: 3,
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-green-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Heart size={26} color="var(--accent-green)" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-green)', textTransform: 'uppercase', fontFamily: 'Fredoka, sans-serif' }}>
                  100% Private Venue
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-blue-dark)', fontFamily: 'Fredoka, sans-serif' }}>
                  Only 1 Booking Per Day
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <div className="fun-eyebrow">
              <Sparkles size={16} />
              <span>Welcome to Thendral Day Out</span>
            </div>

            <h2 style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              color: 'var(--primary-blue-dark)',
              lineHeight: 1.15,
              marginBottom: '20px',
            }}>
              A DAY MADE FOR YOUR PEOPLE
            </h2>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '18px',
              fontWeight: 500,
            }}>
              <strong>THENDRAL DAY OUT</strong> is a private family-friendly destination in Panpoli, Tenkasi, designed for swimming, playing, relaxing and celebrating together.
            </p>

            <p style={{
              fontSize: '1.02rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '28px',
            }}>
              Unlike public swimming pools or crowded parks where you share amenities with strangers, Thendral Day Out gives your group the <strong>entire place exclusively for the booked day</strong>. Splash in the pool, let the kids race down the slide, celebrate a birthday in the hall, and enjoy home-cooked meals in the open garden dining area!
            </p>

            {/* Highlights List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
            }}>
              {highlights.map((text, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    marginTop: '3px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-green-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid #86efac',
                  }}>
                    <CheckCircle2 size={16} color="var(--accent-green)" />
                  </div>
                  <span style={{ fontSize: '0.94rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a href="#availability" className="btn btn-sunny">
                <span>Check Available Dates</span>
              </a>
              <a href="#facilities" className="btn btn-outline">
                <span>See All 8 Facilities</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
