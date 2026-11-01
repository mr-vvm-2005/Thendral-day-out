'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface AvailabilitySectionProps {
  onSelectDate: (dateStr: string) => void;
}

export default function AvailabilitySection({ onSelectDate }: AvailabilitySectionProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [pendingDates, setPendingDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'available' | 'booked'; text: string } | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        setLoading(true);
        const res = await fetch('/api/availability');
        const data = await res.json();
        if (data.success && Array.isArray(data.bookedDates)) {
          setBookedDates(data.bookedDates);
          if (Array.isArray(data.pendingDates)) {
            setPendingDates(data.pendingDates);
          }
        }
      } catch (err) {
        console.error('Failed to load availability:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const monthFormatted = String(month + 1).padStart(2, '0');
    const dayFormatted = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;

    const cellDate = new Date(`${dateStr}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (cellDate < today) {
      return; // past date
    }

    const isBooked = bookedDates.includes(dateStr);
    setSelectedDateStr(dateStr);

    if (isBooked) {
      setFeedbackMsg({
        type: 'booked',
        text: 'This date is unavailable. Please select another date.',
      });
    } else {
      setFeedbackMsg({
        type: 'available',
        text: `Woohoo! ${dateStr} is available for your private full-day booking!`,
      });
    }
  };

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <section id="availability" className="section-padding" style={{
      backgroundColor: '#ffffff',
      position: 'relative',
    }}>
      <div className="container">
        <div className="section-header">
          <div className="fun-eyebrow">
            <CalendarIcon size={16} />
            <span>Interactive Venue Calendar</span>
          </div>
          <h2 className="section-title">
            PICK YOUR DAY
          </h2>
          <p className="section-desc">
            One booking reserves the whole venue for your group. Select any open date below!
          </p>
        </div>

        <div style={{
          maxWidth: '760px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '32px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-md)',
          padding: 'clamp(18px, 4vw, 32px) clamp(12px, 3vw, 24px)',
        }}>
          {/* Calendar Header with Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}>
            <h3 style={{
              fontFamily: 'Fredoka, sans-serif',
              fontSize: '1.6rem',
              fontWeight: 800,
              color: 'var(--primary-blue-dark)',
            }}>
              {monthNames[month]} {year}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1.5px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-blue-dark)',
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-main)',
                  border: '1.5px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-blue-dark)',
                  transition: 'all 0.2s ease',
                }}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* Color & Accessibility Legend */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 18px',
            backgroundColor: 'var(--bg-main)',
            borderRadius: '16px',
            marginBottom: '24px',
            fontSize: '0.88rem',
            fontWeight: 700,
            fontFamily: 'Fredoka, sans-serif',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-available)' }} />
              <span>🟢 Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-booked)' }} />
              <span>🔴 Booked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              <span>⚪ Past Date</span>
            </div>
          </div>

          {/* Weekday Names */}
          <div className="calendar-grid" style={{ marginBottom: '8px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="calendar-day-header" style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '0.92rem' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className="calendar-grid">
            {emptyCells.map((_, i) => (
              <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
            ))}

            {daysArray.map((day) => {
              const monthFormatted = String(month + 1).padStart(2, '0');
              const dayFormatted = String(day).padStart(2, '0');
              const cellDateStr = `${year}-${monthFormatted}-${dayFormatted}`;

              const cellDate = new Date(`${cellDateStr}T00:00:00`);
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const isPast = cellDate < today;
              const isBooked = bookedDates.includes(cellDateStr);
              const isSelected = selectedDateStr === cellDateStr;

              let cellClass = 'calendar-day-cell';
              if (isPast) {
                cellClass += ' past';
              } else if (isBooked) {
                cellClass += ' booked';
              } else {
                cellClass += ' available';
              }

              if (isSelected) {
                cellClass += ' selected';
              }

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDateClick(day)}
                  className={cellClass}
                  style={{
                    borderRadius: '14px',
                    fontFamily: 'Fredoka, sans-serif',
                  }}
                  aria-label={`Date ${cellDateStr}, status: ${isPast ? 'past' : isBooked ? 'booked' : 'available'}`}
                >
                  <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{day}</span>
                  {!isPast && (
                    <span style={{
                      fontSize: '0.65rem',
                      lineHeight: 1,
                      marginTop: '3px',
                      textTransform: 'uppercase',
                      fontWeight: 800,
                    }}>
                      {isBooked ? 'Booked' : 'Open'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Notification Box */}
          {feedbackMsg && (
            <div style={{
              marginTop: '28px',
              padding: '20px 24px',
              borderRadius: '20px',
              backgroundColor: feedbackMsg.type === 'available' ? 'var(--color-available-bg)' : 'var(--color-booked-bg)',
              border: `2px solid ${feedbackMsg.type === 'available' ? 'var(--color-available)' : 'var(--color-booked)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {feedbackMsg.type === 'available' ? (
                  <CheckCircle size={26} color="var(--color-available)" />
                ) : (
                  <AlertTriangle size={26} color="var(--color-booked)" />
                )}
                <span style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  fontFamily: 'Fredoka, sans-serif',
                  color: feedbackMsg.type === 'available' ? '#14532d' : '#7f1d1d',
                }}>
                  {feedbackMsg.text}
                </span>
              </div>

              {feedbackMsg.type === 'available' && selectedDateStr && (
                <button
                  onClick={() => onSelectDate(selectedDateStr)}
                  className="btn btn-primary btn-sm"
                  style={{
                    backgroundColor: 'var(--color-available)',
                    padding: '12px 24px',
                  }}
                >
                  <span>BOOK THIS DATE (₹3,000 • OFFER)</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          )}

          {/* Pricing reminder */}
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            fontFamily: 'Fredoka, sans-serif',
          }}>
            Exclusive full-day rate: <s style={{ color: '#94a3b8', textDecorationColor: '#ef4444', margin: '0 6px', fontWeight: 700 }}>₹5,000</s> <strong style={{ color: 'var(--accent-green)', fontSize: '1.25rem' }}>₹3,000</strong> <span style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.78rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', marginLeft: '6px' }}>🔥 OFFER IS GOING ON NOW • BOOK NOW!</span> for your entire family & friends!
          </div>
        </div>
      </div>
    </section>
  );
}
