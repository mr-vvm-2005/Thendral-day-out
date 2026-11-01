'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarSearch, CalendarCheck, Phone, MessageCircle, MapPin, Sparkles, CheckCircle2, Flame, Tag } from 'lucide-react';

interface HeroProps {
  onCheckAvailability: () => void;
  onBookNow: () => void;
}

export default function Hero({ onCheckAvailability, onBookNow }: HeroProps) {
  const whatsappUrl =
    'https://wa.me/918778038383?text=' +
    encodeURIComponent('Hello Thendral Day Out, I would like to enquire about a private full-day booking. My preferred date is ______');

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 45%, #0f766e 100%)',
      color: '#ffffff',
      paddingTop: '60px',
      paddingBottom: '120px',
    }}>
      {/* Real Venue Swimming Pool Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        opacity: 0.38,
      }}>
        <Image
          src="/images/pool-main.jpg"
          alt="Thendral Day Out Swimming Pool in Panpoli Tenkasi"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
        />
      </div>

      {/* Sunny Tropical Ambient Light & Vignette Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        background: 'radial-gradient(circle at 50% 20%, rgba(254, 240, 138, 0.22) 0%, rgba(2, 132, 199, 0.75) 50%, rgba(3, 72, 112, 0.92) 100%)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        {/* Floating Badges Strip across top */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '28px',
        }}>
          <div className="floating-badge" style={{ color: 'var(--primary-blue-dark)' }}>
            <span>💦</span> Swimming Pool & Falls
          </div>
          <div className="floating-badge" style={{ color: 'var(--primary-blue-dark)' }}>
            <span>👨‍👩‍👧‍👦</span> Family & Friends Fun
          </div>
          <div className="floating-badge" style={{ color: 'var(--primary-blue-dark)' }}>
            <span>🎉</span> Birthday Celebrations
          </div>
          <div className="floating-badge" style={{ color: 'var(--primary-blue-dark)' }}>
            <span>🌿</span> Tropical Garden Space
          </div>
        </div>

        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Location Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-full)',
            border: '1.5px solid rgba(255, 255, 255, 0.35)',
            fontSize: '0.92rem',
            color: '#fef08a',
            marginBottom: '16px',
            fontWeight: 700,
            fontFamily: 'Fredoka, sans-serif',
          }}>
            <MapPin size={17} color="#fef08a" />
            <span>📍 Panpoli, Tenkasi • Near Panpoli Thaika Bus Stop</span>
          </div>

          {/* Hierarchy */}
          <div style={{ marginBottom: '6px' }}>
            <span style={{
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#86efac',
              fontFamily: 'Fredoka, sans-serif',
            }}>
              by THENDRAL GROUPS
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Fredoka, Outfit, sans-serif',
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
            textShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
          }}>
            THENDRAL DAY OUT
          </h1>

          {/* Tagline */}
          <p style={{
            fontFamily: 'Fredoka, Outfit, sans-serif',
            fontSize: 'clamp(1.2rem, 3.2vw, 1.65rem)',
            fontWeight: 600,
            color: '#fef08a',
            letterSpacing: '0.04em',
            marginBottom: '20px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}>
            Swim • Play • Celebrate • Make Memories
          </p>

          <h2 style={{
            fontFamily: 'Fredoka, sans-serif',
            fontSize: 'clamp(1.6rem, 4vw, 2.35rem)',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          }}>
            Your Private Day Out Starts Here.
          </h2>

          <p style={{
            fontSize: 'clamp(1.15rem, 2.6vw, 1.35rem)',
            fontWeight: 600,
            color: '#e0f2fe',
            marginBottom: '36px',
            maxWidth: '720px',
          }}>
            One booking. One day. Your entire place.
          </p>

          {/* GIANT FLOATING PRICE BUBBLE (Wonderla Energy / High Visibility) */}
          <div className="hero-price-bubble" style={{ marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '6px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 800,
              fontFamily: 'Fredoka, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '10px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            }}>
              <Flame size={16} />
              <span>🔥 OFFER IS GOING ON NOW! BOOK NOW!</span>
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
                  fontSize: 'clamp(1.8rem, 4.5vw, 2.6rem)',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  textDecorationColor: '#ef4444',
                  textDecorationThickness: '3.5px',
                  lineHeight: 1,
                }}>
                  ₹5,000
                </span>
                <span style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontFamily: 'Fredoka, sans-serif',
                  letterSpacing: '0.02em',
                }}>
                  SAVE ₹2,000 (40% OFF)
                </span>
              </div>

              {/* Offer price ₹3,000 */}
              <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: 'clamp(3.2rem, 7.5vw, 4.6rem)',
                  fontWeight: 800,
                  color: '#15803d',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}>
                  ₹3,000
                </span>
                <span style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
                  fontWeight: 700,
                  color: '#0284c7',
                  textTransform: 'uppercase',
                }}>
                  / FULL DAY
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#475569',
              fontSize: '0.92rem',
              fontWeight: 700,
              marginTop: '6px',
            }}>
              <CheckCircle2 size={16} color="#15803d" />
              <span>Private booking • Entire place exclusively for your group</span>
            </div>
          </div>

          {/* PRIMARY CTAs */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '28px',
            width: '100%',
          }}>
            <button
              onClick={onCheckAvailability}
              className="btn btn-sunny btn-lg"
              style={{
                flex: '1 1 240px',
                maxWidth: '300px',
              }}
            >
              <CalendarSearch size={24} />
              <span>CHECK AVAILABILITY</span>
            </button>

            <button
              onClick={onBookNow}
              className="btn btn-primary btn-lg"
              style={{
                flex: '1 1 240px',
                maxWidth: '300px',
              }}
            >
              <CalendarCheck size={24} />
              <span>BOOK NOW</span>
            </button>
          </div>

          {/* SECONDARY CONTACT BUTTONS */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
          }}>
            <a
              href="tel:8778038383"
              className="btn btn-outline"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--primary-blue-dark)',
                padding: '12px 24px',
                fontSize: '1rem',
              }}
            >
              <Phone size={18} color="var(--primary-blue)" />
              <span>CALL NOW: 8778038383</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
              }}
            >
              <MessageCircle size={18} />
              <span>WHATSAPP US</span>
            </a>
          </div>

        </div>
      </div>

      {/* Decorative Wave Divider at the bottom of hero */}
      <div className="wave-divider" style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" fill="#f0f9ff">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
