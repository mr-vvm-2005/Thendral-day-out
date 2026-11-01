'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the price?',
      a: 'Special Offer: ₹3,000 for the full-day private booking (Discounted from ₹5,000 — limited-time 40% offer is going on now!).',
    },
    {
      q: 'Is the price per person?',
      a: 'No. The booking is for the venue for the selected date.',
    },
    {
      q: 'Can we bring our own food?',
      a: 'Yes. Guests can bring their own prepared food and use the dining area.',
    },
    {
      q: 'Is there a swimming pool for children?',
      a: 'Yes. Separate adult and kids swimming spaces are available.',
    },
    {
      q: 'Is the entire place private?',
      a: 'A confirmed booking reserves the venue exclusively for the booking group for that date.',
    },
    {
      q: 'How do I book?',
      a: 'Check availability, select your date and contact the business through WhatsApp or phone.',
    },
    {
      q: 'Do you provide food or catering?',
      a: 'No. Thendral Day Out does not operate a restaurant or catering service. Guests are welcome to bring their own prepared meals and use our dry dining area.',
    },
    {
      q: 'Can I celebrate a birthday party here?',
      a: 'Yes! The venue includes a dedicated covered birthday party hall along with the swimming pool, artificial waterfall, kids playground, garden, and dining area.',
    },
  ];

  return (
    <section id="faq" className="section-padding" style={{ backgroundColor: '#ffffff' }}>
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="section-title">
            Everything You Need To Know
          </h2>
          <p className="section-desc">
            Clear answers to common questions about your private day out booking.
          </p>
        </div>

        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  backgroundColor: isOpen ? 'var(--bg-main)' : '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '16px',
                  marginBottom: '12px',
                  overflow: 'hidden',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                  aria-expanded={isOpen}
                >
                  <span style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: isOpen ? 'var(--primary-blue)' : 'var(--primary-blue-dark)',
                  }}>
                    {item.q}
                  </span>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s ease',
                    color: 'var(--text-muted)',
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
