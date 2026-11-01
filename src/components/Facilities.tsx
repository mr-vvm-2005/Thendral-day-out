'use client';

import React from 'react';
import Image from 'next/image';
import { Waves, Sparkles, Smile, PartyPopper, Trees, Utensils, Shirt, Bath } from 'lucide-react';

interface FacilityItem {
  id: string;
  title: string;
  label?: string;
  desc: string;
  icon: React.ReactElement;
  image?: string;
  alt?: string;
  borderColor: string;
  badgeBg: string;
  badgeColor: string;
  foodNotice?: string;
}

export default function Facilities() {
  const facilities: FacilityItem[] = [
    {
      id: 'pool',
      title: 'Swimming Pool',
      label: 'Separate Adult & Kids Spaces',
      desc: 'Crystal clear swimming pool with dedicated shallow areas for kids and deep swimming space for adults.',
      icon: <Waves size={24} color="#0284c7" />,
      image: '/images/pool-main.jpg',
      alt: 'Thendral Day Out swimming pool in Panpoli Tenkasi',
      borderColor: '#bae6fd',
      badgeBg: '#f0f9ff',
      badgeColor: '#0369a1',
    },
    {
      id: 'waterfall',
      title: 'Artificial Falls',
      label: 'Refreshing Waterfall Feature',
      desc: 'Enjoy a refreshing cascade built into the stone wall within the adult swimming pool for maximum splash fun.',
      icon: <Sparkles size={24} color="#0284c7" />,
      image: '/images/falls-feature.jpg',
      alt: 'Thendral Day Out artificial waterfall feature cascading into pool',
      borderColor: '#bae6fd',
      badgeBg: '#f0f9ff',
      badgeColor: '#0369a1',
    },
    {
      id: 'kids',
      title: 'Kids Play Area',
      label: 'Safe & Active Playground',
      desc: 'Dedicated outdoor playground with slide, swings, and climbing sets shaded under tropical coconut trees.',
      icon: <Smile size={24} color="#059669" />,
      image: '/images/kids-play.jpg',
      alt: 'Thendral Day Out kids playground with slide and swings in Panpoli',
      borderColor: '#a7f3d0',
      badgeBg: '#ecfdf5',
      badgeColor: '#065f46',
    },
    {
      id: 'garden',
      title: 'Garden & Relaxation',
      label: 'Tropical Greenery & Palms',
      desc: 'Relax and unwind amidst green lawns, blooming bougainvillea, and tall coconut groves in fresh countryside breeze.',
      icon: <Trees size={24} color="#059669" />,
      borderColor: '#a7f3d0',
      badgeBg: '#ecfdf5',
      badgeColor: '#065f46',
    },
    {
      id: 'party-hall',
      title: 'Birthday Party Hall',
      label: 'Covered Celebration Hall',
      desc: 'Dedicated covered event hall with high ceilings, ceiling fans, wood wainscoting, and room for cake cutting & music.',
      icon: <PartyPopper size={24} color="#d97706" />,
      image: '/images/party-hall.jpg',
      alt: 'Thendral Day Out birthday celebration hall in Panpoli',
      borderColor: '#fde68a',
      badgeBg: '#fffbeb',
      badgeColor: '#b45309',
    },
    {
      id: 'dining',
      title: 'Dining Area',
      label: 'Bring Your Own Prepared Food',
      desc: 'Clean, dry outdoor stone picnic tables and benches shaded under coconut palms where your family can enjoy meals together.',
      icon: <Utensils size={24} color="#d97706" />,
      image: '/images/dining-area.jpg',
      alt: 'Thendral Day Out real dry dining tables and benches surrounded by garden trees',
      borderColor: '#fde68a',
      badgeBg: '#fffbeb',
      badgeColor: '#b45309',
      foodNotice: 'Your Food, Your Celebration • Bring your own prepared food',
    },
    {
      id: 'dressing',
      title: 'Dressing Rooms',
      desc: 'Clean, private changing facilities with wooden seating bench, mirrors, and clothes hooks for guests after swimming.',
      icon: <Shirt size={24} color="#0284c7" />,
      borderColor: '#bae6fd',
      badgeBg: '#f0f9ff',
      badgeColor: '#0369a1',
    },
    {
      id: 'restrooms',
      title: 'Restrooms',
      desc: 'Well-maintained, hygienic restroom facilities with ceramic washbasins easily accessible across the venue.',
      icon: <Bath size={24} color="#059669" />,
      borderColor: '#a7f3d0',
      badgeBg: '#ecfdf5',
      badgeColor: '#065f46',
    },
  ];

  return (
    <section id="facilities" className="section-padding" style={{
      backgroundColor: '#f8fafc',
      position: 'relative',
    }}>
      <div className="container">
        <div className="section-header">
          <div className="fun-eyebrow">
            <Sparkles size={16} />
            <span>All Included In Your Booking</span>
          </div>
          <h2 className="section-title">
            EVERYTHING YOU NEED FOR A GREAT DAY OUT
          </h2>
          <p className="section-desc">
            8 distinct amenities included with every private booking. Every corner is exclusively reserved for your family & friends!
          </p>
        </div>

        {/* Bring Your Own Prepared Food Notice Banner */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: '24px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '48px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Utensils size={24} color="#d97706" />
          </div>
          <div style={{ fontSize: '1rem', color: '#78350f', lineHeight: 1.5 }}>
            <strong style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.15rem' }}>Bring Your Own Prepared Food:</strong> Guests are warmly welcome to bring their own home-cooked or prepared food and refreshments to enjoy in our dedicated dining space. Please note that Thendral Day Out does not provide restaurant, catering, or cooking services.
          </div>
        </div>

        {/* 8 Facility Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '28px',
        }}>
          {facilities.map((fac) => (
            <div
              key={fac.id}
              className="facility-fun-card"
              style={{
                borderColor: 'var(--border-light)',
              }}
            >
              {/* Image or Dedicated Icon-Only Presentation */}
              {fac.image ? (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/11',
                  overflow: 'hidden',
                  backgroundColor: '#e2e8f0',
                }}>
                  <Image
                    src={fac.image}
                    alt={fac.alt || fac.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  {/* Floating Tag */}
                  {fac.label && (
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: fac.badgeBg,
                      color: fac.badgeColor,
                      border: `1.5px solid ${fac.borderColor}`,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      fontFamily: 'Fredoka, sans-serif',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}>
                      {fac.label}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/11',
                  background: `linear-gradient(135deg, ${fac.badgeBg} 0%, #ffffff 100%)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: `2px dashed ${fac.borderColor}`,
                  overflow: 'hidden',
                }}>
                  {/* Decorative ambient bubbles */}
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    right: '-25px',
                    width: '110px',
                    height: '110px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '-20px',
                    left: '-20px',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  }} />

                  {/* Centered Large Floating Icon */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '26px',
                    backgroundColor: '#ffffff',
                    border: `2.5px solid ${fac.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative',
                    zIndex: 2,
                    transition: 'transform 0.3s ease',
                  }}>
                    {React.cloneElement(fac.icon as React.ReactElement<{ size?: number }>, { size: 44 })}
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: fac.badgeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {fac.icon}
                  </div>
                  <h3 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue-dark)',
                  }}>
                    {fac.title}
                  </h3>
                </div>

                <p style={{
                  fontSize: '0.94rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  flexGrow: 1,
                }}>
                  {fac.desc}
                </p>

                {fac.foodNotice && (
                  <div style={{
                    marginTop: '14px',
                    padding: '8px 14px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#92400e',
                    fontFamily: 'Fredoka, sans-serif',
                  }}>
                    🍱 {fac.foodNotice}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
