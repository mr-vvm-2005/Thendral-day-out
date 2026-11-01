import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldAlert, Clock, Waves, Utensils, Baby, Sparkles, Phone, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Venue Rules & Guidelines | Thendral Day Out',
  description: 'General safety guidelines, pool rules, food policies, and timing details for Thendral Day Out in Panpoli, Tenkasi.',
};

export default function RulesPage() {
  const guidelines = [
    {
      icon: <Clock size={24} color="var(--primary-blue)" />,
      title: 'Timings & Full-Day Access',
      details: [
        'Standard full-day access hours: 09:00 AM to 06:00 PM.',
        'The entire property is exclusively reserved for your group during this period.',
        'Early arrivals or delayed exits must be coordinated with venue management in advance.',
      ],
    },
    {
      icon: <Waves size={24} color="var(--primary-blue-light)" />,
      title: 'Swimming Pool & Artificial Falls Safety',
      details: [
        'Proper swimming attire is recommended for pool hygiene and water quality.',
        'No diving or reckless horseplay in shallow pool sections.',
        'Glassware, sharp objects, and heavy items are strictly prohibited near the pool deck.',
        'Please shower before entering the swimming pools.',
      ],
    },
    {
      icon: <Baby size={24} color="var(--accent-green)" />,
      title: 'Children Supervision',
      details: [
        'Children must be supervised by an accompanying adult at all times, especially in the swimming pools and playground.',
        'A dedicated safe kids pool and play area are available for children.',
      ],
    },
    {
      icon: <Utensils size={24} color="var(--accent-yellow)" />,
      title: 'Food, Beverages & Dining Area',
      details: [
        'Guests are welcome to bring their own prepared food, snacks, and refreshments.',
        'Dining must take place within the dedicated outdoor dining area or party hall.',
        'Eating and drinking inside the swimming pool water is strictly prohibited.',
        'Please note that Thendral Day Out does not provide restaurant, catering, or live cooking facilities.',
      ],
    },
    {
      icon: <Sparkles size={24} color="#7c3aed" />,
      title: 'Venue Cleanliness & Property Care',
      details: [
        'Waste bins are provided across the premises; please help keep our gardens and pool clean.',
        'Any physical damage to venue fixtures, water pumps, or hall equipment caused during the booking is the responsibility of the booking party.',
      ],
    },
  ];

  return (
    <main>
      <Header />
      <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '80vh', padding: '60px 0' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--primary-blue)',
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '40px 32px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-blue-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldAlert size={24} color="var(--primary-blue)" />
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  Venue Rules & Guidelines
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  For a safe, comfortable, and memorable experience at Thendral Day Out.
                </p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {guidelines.map((g, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {g.icon}
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                      {g.title}
                    </h2>
                  </div>
                  <ul style={{ paddingLeft: '34px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {g.details.map((d, di) => (
                      <li key={di} style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '40px',
              padding: '20px',
              borderRadius: '16px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                  Questions or special assistance?
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Contact our venue manager directly anytime.
                </div>
              </div>
              <a href="tel:8778038383" className="btn btn-primary btn-sm">
                <Phone size={16} />
                <span>Call 8778038383</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
