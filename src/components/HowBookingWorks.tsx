'use client';

import React from 'react';
import { CalendarSearch, UserCheck, PhoneCall, QrCode, ShieldCheck, TicketCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function HowBookingWorks() {
  const steps = [
    {
      num: '01',
      title: 'CHECK DATE',
      desc: 'Pick your preferred date on our live venue calendar.',
      icon: <CalendarSearch size={28} color="#0284c7" />,
      color: '#0284c7',
      bg: '#f0f9ff',
      borderColor: '#bae6fd',
    },
    {
      num: '02',
      title: 'SHARE DETAILS',
      desc: 'Enter just your name and mobile number. No long forms.',
      icon: <UserCheck size={28} color="#0284c7" />,
      color: '#0284c7',
      bg: '#f0f9ff',
      borderColor: '#bae6fd',
    },
    {
      num: '03',
      title: 'CONTACT US',
      desc: 'Connect with our team via Call or WhatsApp instantly.',
      icon: <PhoneCall size={28} color="#0284c7" />,
      color: '#0284c7',
      bg: '#f0f9ff',
      borderColor: '#bae6fd',
    },
    {
      num: '04',
      title: 'PAY ₹3,000',
      desc: 'Complete your full-day booking payment conveniently via UPI.',
      icon: <QrCode size={28} color="#059669" />,
      color: '#059669',
      bg: '#ecfdf5',
      borderColor: '#a7f3d0',
    },
    {
      num: '05',
      title: 'CONFIRMATION',
      desc: 'Admin confirms your payment and reserves your private date.',
      icon: <ShieldCheck size={28} color="#059669" />,
      color: '#059669',
      bg: '#ecfdf5',
      borderColor: '#a7f3d0',
    },
    {
      num: '06',
      title: 'DIGITAL TICKET',
      desc: 'Receive your verified digital ticket with QR code for entry!',
      icon: <TicketCheck size={28} color="#d97706" />,
      color: '#d97706',
      bg: '#fffbeb',
      borderColor: '#fde68a',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding" style={{
      backgroundColor: '#f8fafc',
      position: 'relative',
    }}>
      <div className="container">
        <div className="section-header">
          <div className="fun-eyebrow">
            <Sparkles size={16} />
            <span>Super Simple 6-Step Journey</span>
          </div>
          <h2 className="section-title">
            HOW EASY IS IT TO BOOK?
          </h2>
          <p className="section-desc">
            No complicated packages or per-person headcount math. Just pick a date, confirm with us, and get your ticket!
          </p>
        </div>

        {/* 6-Step Stepper Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
        }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="booking-step-card"
              style={{
                borderColor: 'var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: step.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                  }}>
                    {step.icon}
                  </div>
                  <span style={{
                    fontFamily: 'Fredoka, sans-serif',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: step.color,
                    opacity: 0.85,
                  }}>
                    {step.num}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Fredoka, sans-serif',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--primary-blue-dark)',
                  marginBottom: '8px',
                  lineHeight: 1.25,
                }}>
                  {step.title}
                </h3>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.45,
                }}>
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div style={{
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  color: step.color,
                  opacity: 0.6,
                }}>
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
