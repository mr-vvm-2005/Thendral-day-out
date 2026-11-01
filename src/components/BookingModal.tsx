'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar, Phone, MessageCircle, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string | null;
}

export default function BookingModal({ isOpen, onClose, initialDate }: BookingModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(initialDate || '');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedBooking, setSubmittedBooking] = useState<{
    bookingId: string;
    date: string;
    amount: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!date) {
      setErrorMsg('Please choose your preferred booking date.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          date,
          message: message.trim(),
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to submit enquiry. Please check your details.');
        return;
      }

      setSubmittedBooking({
        bookingId: data.bookingId,
        date: data.date,
        amount: data.amount,
        message: data.message,
      });

      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if not supported
      }
    } catch {
      setErrorMsg('Unable to connect to server. Please call us directly at 8778038383.');
    } finally {
      setLoading(false);
    }
  };

  const formattedWhatsAppUrl = submittedBooking
    ? `https://wa.me/918778038383?text=${encodeURIComponent(
        `Hello Thendral Day Out, I have requested a private booking for ${submittedBooking.date} (Enquiry ID: ${submittedBooking.bookingId}). Please guide me to complete the ₹3,000 UPI payment.`
      )}`
    : `https://wa.me/918778038383?text=${encodeURIComponent(
        `Hello Thendral Day Out, I would like to enquire about a private full-day booking. My preferred date is ${date || '______'}.`
      )}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(3, 40, 68, 0.78)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '32px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: 'min(92vh, 840px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          animation: 'fadeIn 0.25s ease',
          border: '3px solid var(--border-playful)',
        }}
      >
        {/* Playful Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#fef08a',
              textTransform: 'uppercase',
              fontFamily: 'Fredoka, sans-serif',
              letterSpacing: '0.05em',
            }}>
              Thendral Day Out • Private Booking
            </div>
            <h3 style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
            }}>
              {submittedBooking ? 'Enquiry Registered! 🎉' : 'Book Your Family Day Out'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#ffffff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
            aria-label="Close booking modal"
          >
            <X size={22} />
          </button>
        </div>

        {submittedBooking ? (
          /* Confirmation Screen */
          <div style={{ padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 28px)', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-green-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                border: '3px solid #86efac',
              }}>
                <CheckCircle2 size={40} color="var(--accent-green)" />
              </div>
              <h4 style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--primary-blue-dark)',
                marginBottom: '6px',
              }}>
                Great! Enquiry Received!
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                Your Booking Reference: <strong style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: 'var(--primary-blue)' }}>{submittedBooking.bookingId}</strong>
              </p>
            </div>

            {/* Price Box */}
            <div style={{
              backgroundColor: '#fefce8',
              borderRadius: '20px',
              padding: '20px',
              border: '2px solid #fde047',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#854d0e', fontFamily: 'Fredoka, sans-serif' }}>
                Private Full-Day Booking for <strong>{submittedBooking.date}</strong>
              </div>
              <div style={{
                fontFamily: 'Fredoka, sans-serif',
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--accent-green)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
                gap: '10px',
              }}>
                <span style={{ fontSize: '1.4rem', color: '#94a3b8', textDecoration: 'line-through', textDecorationColor: '#ef4444', fontWeight: 700 }}>₹5,000</span>
                <span>₹3,000</span>
              </div>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                marginBottom: '6px',
                fontFamily: 'Fredoka, sans-serif',
              }}>
                🔥 SPECIAL OFFER APPLIED (SAVE ₹2,000)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#713f12', fontWeight: 600 }}>
                Entire venue reserved exclusively for your family & friends
              </div>
            </div>

            {/* Next Step Instructions */}
            <div style={{
              backgroundColor: '#e0f2fe',
              border: '2px solid #7dd3fc',
              borderRadius: '18px',
              padding: '18px 20px',
              marginBottom: '28px',
            }}>
              <div style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.05rem', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
                How to Confirm Your Reservation:
              </div>
              <p style={{ fontSize: '0.92rem', color: '#0c4a6e', lineHeight: 1.55 }}>
                Contact us via WhatsApp or Call and complete the <strong>₹3,000 payment via UPI</strong>. Once confirmed, your verified digital ticket with QR code will be generated!
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={formattedWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
                style={{ width: '100%' }}
              >
                <MessageCircle size={22} />
                <span>Confirm on WhatsApp</span>
              </a>

              <a
                href="tel:8778038383"
                className="btn btn-outline btn-lg"
                style={{ width: '100%' }}
              >
                <Phone size={20} color="var(--primary-blue)" />
                <span>Call Us: 8778038383</span>
              </a>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} style={{ padding: 'clamp(18px, 4vw, 28px)', overflowY: 'auto' }}>
            {/* Price Pill banner */}
            <div style={{
              backgroundColor: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '18px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontFamily: 'Fredoka, sans-serif',
                  marginBottom: '4px',
                }}>
                  🔥 SPECIAL OFFER IS GOING ON NOW!
                </div>
                <div style={{ fontSize: '0.82rem', color: '#7f1d1d', fontWeight: 600 }}>
                  Entire private venue reserved exclusively for your group
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '1.05rem',
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  textDecorationColor: '#ef4444',
                  fontWeight: 700,
                  fontFamily: 'Fredoka, sans-serif',
                }}>
                  ₹5,000
                </div>
                <div style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '1.9rem',
                  fontWeight: 800,
                  color: '#15803d',
                  lineHeight: 1,
                }}>
                  ₹3,000
                </div>
              </div>
            </div>

            {errorMsg && (
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--color-booked-bg)',
                color: '#991b1b',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <AlertCircle size={20} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Anti-spam hidden honeypot */}
            <div style={{ display: 'none' }}>
              <input
                type="text"
                name="website_check"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '12px',
                  border: '2px solid var(--border-light)',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Mobile Number */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Mobile Number (for booking confirmation) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9840123456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '12px',
                  border: '2px solid var(--border-light)',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Preferred Date */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Preferred Booking Date *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '13px 18px',
                  borderRadius: '12px',
                  border: '2px solid var(--border-light)',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            {/* Optional Occasion Note */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontFamily: 'Fredoka, sans-serif', fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Occasion / Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Birthday celebration, family reunion, weekend get-together..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid var(--border-light)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Assurance */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginBottom: '22px',
              fontWeight: 600,
            }}>
              <ShieldCheck size={18} color="var(--accent-green)" />
              <span>Zero online card details required. Confirm safely via UPI.</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {loading ? 'Checking Availability...' : 'Submit Booking Request (₹3,000)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
