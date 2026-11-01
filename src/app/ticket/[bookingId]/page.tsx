'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Waves,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Camera,
  FileImage,
} from 'lucide-react';
import { generateTicketImage, downloadTicketDataUrl } from '@/lib/ticketImage';

export default function TicketPage() {
  const params = useParams();
  const bookingId = params?.bookingId as string;

  const [ticketData, setTicketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingImage, setDownloadingImage] = useState(false);

  useEffect(() => {
    async function loadTicket() {
      try {
        setLoading(true);
        const res = await fetch(`/api/ticket?id=${bookingId}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || 'Ticket not found.');
        } else {
          setTicketData(data.ticket);
        }
      } catch {
        setError('Failed to load booking ticket.');
      } finally {
        setLoading(false);
      }
    }
    if (bookingId) {
      loadTicket();
    }
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    if (!ticketData) return;
    try {
      setDownloadingImage(true);
      const dataUrl = await generateTicketImage({
        bookingId: ticketData.booking_id,
        customerName: ticketData.customer_name,
        bookingDate: ticketData.booking_date,
        amount: ticketData.amount,
        bookingStatus: ticketData.booking_status,
        paymentStatus: ticketData.payment_status,
        paymentMethod: ticketData.payment_method,
        paymentReference: ticketData.payment_reference,
        qrCodeUrl: ticketData.qr_code,
        verifyUrl: ticketData.verify_url,
        location: ticketData.venue?.location,
        phone: ticketData.venue?.phone,
      });
      downloadTicketDataUrl(dataUrl, ticketData.booking_id, ticketData.customer_name);
    } catch (err) {
      console.error('Failed to generate ticket image:', err);
      alert('Could not generate ticket image. Please try again.');
    } finally {
      setDownloadingImage(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!ticketData) return;
    const msg = `Here is my confirmed digital booking ticket for THENDRAL DAY OUT on ${ticketData.booking_date} (Booking ID: ${ticketData.booking_id}). Verification: ${ticketData.verify_url}`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
            Loading your Digital Booking Ticket...
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', padding: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px', maxWidth: '480px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          <AlertCircle size={44} color="#dc2626" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
            Ticket Unavailable
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {error || 'Unable to retrieve the requested booking ticket.'}
          </p>
          <Link href="/" className="btn btn-primary btn-sm">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Navigation & Action Bar (Hidden during print) */}
        <div className="no-print" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '24px',
        }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--primary-blue)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              onClick={handleDownloadImage}
              disabled={downloadingImage}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: 'var(--accent-green)' }}
            >
              <FileImage size={15} />
              <span>{downloadingImage ? 'Generating Image...' : 'Download as Image (PNG)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: 'var(--primary-blue)' }}
            >
              <Download size={15} />
              <span>Download PDF / Print</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="btn btn-whatsapp btn-sm"
            >
              <Share2 size={15} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE TICKET CARD */}
        <div
          className="ticket-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '2px solid rgba(11, 79, 138, 0.18)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Header Strip */}
          <div style={{
            background: 'linear-gradient(135deg, #072b4a 0%, #0b4f8a 60%, #156526 100%)',
            color: '#ffffff',
            padding: '28px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                position: 'relative',
                width: '60px',
                height: '60px',
                borderRadius: '14px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                padding: '4px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <Image
                  src="/images/logo.png"
                  alt="Thendral Day Out"
                  width={60}
                  height={60}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  by THENDRAL GROUPS
                </span>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
                  THENDRAL DAY OUT
                </h1>
                <div style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: 600 }}>
                  Swim • Play • Celebrate • Make Memories
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '10px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              textAlign: 'right',
            }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#a7f3d0', fontWeight: 700 }}>
                Ticket Category
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                PRIVATE FULL-DAY BOOKING
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div style={{ padding: '32px' }}>
            {/* Status & ID banner */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              backgroundColor: 'var(--accent-green-soft)',
              padding: '16px 20px',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '28px',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green-dark)', textTransform: 'uppercase' }}>
                  Official Booking Reference ID
                </div>
                <div style={{ fontFamily: 'Outfit, monospace', fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-green-dark)' }}>
                  {ticketData.booking_id}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="status-badge" style={{ backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
                  <CheckCircle2 size={14} />
                  <span>BOOKING: {ticketData.booking_status}</span>
                </span>
                <span className="status-badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}>
                  <span>PAYMENT: {ticketData.payment_status}</span>
                </span>
              </div>
            </div>

            {/* Customer & Booking Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}>
              {/* Left col */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Customer / Group Name
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                    {ticketData.customer_name}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Reserved Booking Date
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                    <Calendar size={20} />
                    <span>{ticketData.booking_date} (Full Day)</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Timing Access
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <Clock size={18} color="var(--primary-blue)" />
                    <span>09:00 AM – 06:00 PM (Exclusive Venue)</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Amount Paid
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                    ₹{ticketData.amount.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>({ticketData.payment_method} Verified)</span>
                  </div>
                </div>
              </div>

              {/* Right col: QR Code & Verification */}
              <div style={{
                backgroundColor: 'var(--bg-main)',
                padding: '20px',
                borderRadius: '18px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
              }}>
                {ticketData.qr_code && (
                  <div style={{
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '10px',
                  }}>
                    <Image
                      src={ticketData.qr_code}
                      alt="Booking Verification QR"
                      width={170}
                      height={170}
                      style={{ display: 'block' }}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                  <ShieldCheck size={16} color="var(--accent-green)" />
                  <span>Scan to Verify Ticket Authenticity</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Secure reference token encoded
                </div>
              </div>
            </div>

            {/* Included Facilities */}
            <div style={{
              borderTop: '1px solid var(--border-light)',
              paddingTop: '24px',
              marginBottom: '28px',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-blue-dark)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Included Exclusive Venue Facilities
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '8px',
              }}>
                {ticketData.facilities?.map((f: string, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Location & Contact */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '16px',
              padding: '18px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={20} color="var(--primary-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                    Venue Address
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {ticketData.venue?.location}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="https://maps.app.goo.gl/SoSykGNBFHepynWr9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm no-print"
                  style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                >
                  <MapPin size={15} color="var(--primary-blue)" />
                  <span>Get Directions</span>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Phone size={20} color="var(--accent-green)" />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      Helpdesk Phone
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-green)' }}>
                      {ticketData.venue?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Footer Strip */}
          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '14px 32px',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-light)',
          }}>
            This digital ticket confirms exclusive full-day venue reservation for {ticketData.booking_date}. Please carry this ticket or display it upon arrival.
          </div>
        </div>
      </div>
    </div>
  );
}
