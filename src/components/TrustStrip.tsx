'use client';

import React from 'react';
import { Waves, Users, PartyPopper, Trees, IndianRupee, Sparkles } from 'lucide-react';

export default function TrustStrip() {
  const benefits = [
    {
      icon: <Waves size={30} color="#0284c7" />,
      title: 'Private Full-Day Experience',
      desc: 'The entire venue is 100% reserved exclusively for your group for the full date.',
      color: '#0284c7',
      bg: '#f0f9ff',
      borderColor: '#bae6fd',
    },
    {
      icon: <Users size={30} color="#059669" />,
      title: 'Family & Friends',
      desc: 'Bring your family, kids, cousins, and friends together with complete privacy.',
      color: '#059669',
      bg: '#ecfdf5',
      borderColor: '#a7f3d0',
    },
    {
      icon: <PartyPopper size={30} color="#d97706" />,
      title: 'Birthday Celebrations',
      desc: 'Dedicated covered party hall for cake cutting, fun games, and celebrations.',
      color: '#d97706',
      bg: '#fffbeb',
      borderColor: '#fde68a',
    },
    {
      icon: <Trees size={30} color="#059669" />,
      title: 'Garden & Relaxation',
      desc: 'Relax amidst coconut palms, open breeze, artificial waterfall & outdoor seating.',
      color: '#059669',
      bg: '#ecfdf5',
      borderColor: '#a7f3d0',
    },
    {
      icon: <IndianRupee size={30} color="#0284c7" />,
      title: '₹3,000 / Day (Offer!)',
      desc: 'Special offer discounted from ₹5,000! Flat pricing for your entire group — never per person.',
      color: '#0284c7',
      bg: '#f0f9ff',
      borderColor: '#bae6fd',
    },
  ];

  return (
    <section id="why-us" style={{
      backgroundColor: '#f8fafc',
      paddingTop: '32px',
      paddingBottom: '64px',
      position: 'relative',
    }}>
      <div className="container">
        {/* Section Headline */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="fun-eyebrow">
            <Sparkles size={16} />
            <span>Exclusive Venue Benefits</span>
          </div>
          <h2 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 800,
            color: 'var(--primary-blue-dark)',
            letterSpacing: '0.02em',
          }}>
            ONE BOOKING. ONE DAY. YOUR PRIVATE PLACE.
          </h2>
        </div>

        {/* Playful Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
        }}>
          {benefits.map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '28px 22px',
                border: '1.5px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'var(--primary-blue-light)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: item.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
              }}>
                {item.icon}
              </div>

              <h3 style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--primary-blue-dark)',
                marginBottom: '8px',
                lineHeight: 1.25,
              }}>
                {item.title}
              </h3>

              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
