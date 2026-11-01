'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, Clock, Sparkles } from 'lucide-react';

export default function LocationSection() {
  const googleMapsUrl = 'https://maps.app.goo.gl/SoSykGNBFHepynWr9';
  const whatsappUrl =
    'https://wa.me/918778038383?text=' +
    encodeURIComponent('Hello Thendral Day Out, I would like to get directions and check availability for a day out.');

  return (
    <section id="location" className="section-padding" style={{
      backgroundColor: '#f8fafc',
      position: 'relative',
    }}>
      <div className="container">
        <div className="section-header">
          <div className="fun-eyebrow">
            <MapPin size={16} />
            <span>Panpoli, Tenkasi Destination</span>
          </div>
          <h2 className="section-title">
            FIND US IN PANPOLI 📍
          </h2>
          <p className="section-desc">
            Conveniently located near Panpoli Thaika Bus Stop in Tenkasi, surrounded by green countryside and fresh breeze.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'stretch',
        }}>
          {/* Contact & Location Info Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '32px',
            padding: '40px 32px',
            border: '1.5px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--primary-blue-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1.5px solid #7dd3fc',
                }}>
                  <MapPin size={28} color="var(--primary-blue)" />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue-dark)',
                    marginBottom: '4px',
                  }}>
                    Venue Address
                  </h3>
                  <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 600 }}>
                    Near Panpoli Thaika Bus Stop,<br />
                    Panpoli, Tenkasi,<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--accent-green-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1.5px solid #86efac',
                }}>
                  <Phone size={28} color="var(--accent-green)" />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue-dark)',
                    marginBottom: '4px',
                  }}>
                    Direct Phone Contact
                  </h3>
                  <a
                    href="tel:8778038383"
                    style={{
                      fontFamily: 'Fredoka, sans-serif',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--accent-green)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    8778038383
                  </a>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Call or WhatsApp our team anytime
                  </div>
                </div>
              </div>

              {/* Timings */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '36px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  backgroundColor: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1.5px solid #fde047',
                }}>
                  <Clock size={28} color="#d97706" />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--primary-blue-dark)',
                    marginBottom: '4px',
                  }}>
                    Full-Day Access Hours
                  </h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    09:00 AM – 06:00 PM (Exclusive full-day booking for ₹3,000)
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons with Exact Google Maps Link */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sunny btn-lg"
                style={{ width: '100%' }}
              >
                <Navigation size={22} />
                <span>📍 GET DIRECTIONS</span>
              </a>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="tel:8778038383"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <Phone size={18} />
                  <span>CALL 8778038383</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ flex: 1 }}
                >
                  <MessageCircle size={18} />
                  <span>WHATSAPP US</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Google Maps Frame */}
          <div style={{
            borderRadius: '32px',
            overflow: 'hidden',
            border: '1.5px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            minHeight: '400px',
            backgroundColor: '#e2e8f0',
          }}>
            <iframe
              title="Thendral Day Out Location Panpoli Tenkasi"
              src="https://maps.google.com/maps?q=9.0184843,77.261947(Thendral%20Day%20Out)&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
