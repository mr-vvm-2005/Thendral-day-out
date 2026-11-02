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
  FileImage,
  Navigation,
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
            Loading your Digital Booking Pass...
          </div>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '36px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
          <AlertCircle size={44} color="#dc2626" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#991b1b', marginBottom: '8px' }}>
            Ticket Unavailable
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.92rem' }}>
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
    <div className="ticket-page-root" style={{ backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '32px 14px' }}>
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
        {/* Navigation & Action Bar */}
        <div className="no-print" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.88rem',
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
              style={{ backgroundColor: 'var(--accent-green)', fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <FileImage size={15} />
              <span>{downloadingImage ? 'Generating Image...' : 'Download Image (PNG)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: 'var(--primary-blue)', fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <Download size={15} />
              <span>Download PDF / Print</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="btn btn-whatsapp btn-sm"
              style={{ fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <Share2 size={15} />
              <span>Share WhatsApp</span>
            </button>
          </div>
        </div>

        {/* NEAT COMPACT EVENT PASS TICKET (Matching Reference Style) */}
        <div className="ticket-frame">
          <div className="ticket-body">
            {/* Left Photo Section */}
            <div className="ticket-photo-col">
              <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '180px' }}>
                <Image
                  src="/images/pool-main.jpg"
                  alt="Thendral Day Out Venue Pool"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div className="ticket-photo-badge">
                  <span>100% PRIVATE VENUE</span>
                </div>
              </div>
            </div>

            {/* Center Content Section */}
            <div className="ticket-center-col">
              {/* Brand Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  padding: '2px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Image src="/images/logo.png" alt="Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                    THENDRAL DAY OUT
                  </div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    by Thendral Groups
                  </div>
                </div>
              </div>

              {/* Kicker & Bold Title */}
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                FOR YOUR PRIVATE CELEBRATION
              </div>
              <h1 style={{
                fontFamily: 'Outfit, Fredoka, sans-serif',
                fontSize: 'clamp(1.25rem, 3.2vw, 1.65rem)',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.15,
                marginBottom: '10px',
              }}>
                Swim, Play & Celebrate.
              </h1>

              {/* Guest & Timing Details Grid */}
              <div className="ticket-details-grid">
                <div>
                  <span className="detail-label">GUEST</span>
                  <div className="detail-value">{ticketData.customer_name}</div>
                </div>
                <div>
                  <span className="detail-label">DATE</span>
                  <div className="detail-value" style={{ color: '#0284c7' }}>{ticketData.booking_date}</div>
                </div>
                <div>
                  <span className="detail-label">TIME</span>
                  <div className="detail-value">9:00 AM – 6:00 PM</div>
                </div>
                <div>
                  <span className="detail-label">PASS</span>
                  <div className="detail-value" style={{ color: '#15803d' }}>₹{ticketData.amount.toLocaleString()} Paid</div>
                </div>
              </div>

              {/* Amenities Pills */}
              <div className="ticket-pills-wrap">
                <span className="ticket-pill">Swimming Pool</span>
                <span className="ticket-pill">Waterfalls</span>
                <span className="ticket-pill">Kids Pool</span>
                <span className="ticket-pill">Party Hall</span>
                <span className="ticket-pill">Garden</span>
              </div>

              {/* Red Link Pill */}
              <div style={{ marginTop: '12px' }}>
                <span className="ticket-action-pill">
                  thendraldayout.com • Panpoli, Tenkasi
                </span>
              </div>
            </div>

            {/* Perforation Separator with Notch Cutouts */}
            <div className="ticket-perforation-divider">
              <div className="ticket-notch notch-top" />
              <div className="ticket-dashed-line" />
              <div className="ticket-notch notch-bottom" />
            </div>

            {/* Right Stub Section */}
            <div className="ticket-stub-col">
              <div className="stub-header">
                <span className="stub-label">ENTRY PASS</span>
                <span className="stub-number">No. {ticketData.booking_id}</span>
              </div>

              {ticketData.qr_code && (
                <div className="stub-qr-container">
                  <Image
                    src={ticketData.qr_code}
                    alt="Ticket QR Code"
                    width={116}
                    height={116}
                    style={{ display: 'block' }}
                  />
                </div>
              )}

              <div className="stub-scan-caption">
                SCAN AT THE GATE
              </div>

              {/* Barcode Graphic */}
              <div className="stub-barcode-wrap">
                <svg viewBox="0 0 160 26" className="barcode-svg" preserveAspectRatio="none">
                  <rect x="0" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="5" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="9" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="15" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="18" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="23" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="27" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="33" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="37" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="40" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="45" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="49" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="55" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="59" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="64" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="67" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="73" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="77" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="82" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="85" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="90" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="96" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="100" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="103" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="109" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="113" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="118" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="121" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="126" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="130" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="136" y="0" width="1" height="26" fill="#1e293b" />
                  <rect x="139" y="0" width="3" height="26" fill="#1e293b" />
                  <rect x="144" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="148" y="0" width="4" height="26" fill="#1e293b" />
                  <rect x="154" y="0" width="2" height="26" fill="#1e293b" />
                  <rect x="158" y="0" width="2" height="26" fill="#1e293b" />
                </svg>
                <div className="barcode-number">
                  * {ticketData.booking_id} *
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Venue Location & Contact Strip */}
        <div className="no-print" style={{
          marginTop: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '14px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
            <MapPin size={18} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
            <span>Near Panpoli Thaika Bus Stop, Panpoli, Tenkasi</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://maps.app.goo.gl/Ka1aie81ZXqbWSN89"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Navigation size={14} color="var(--primary-blue)" />
              <span>Get Directions</span>
            </a>

            <a
              href="tel:8778038383"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 800, textDecoration: 'none' }}
            >
              <Phone size={16} />
              <span>8778038383</span>
            </a>
          </div>
        </div>
      </div>

      {/* TICKET STYLING */}
      <style jsx>{`
        .ticket-frame {
          background-color: #b91c1c;
          border-radius: 24px;
          padding: 8px;
          box-shadow: 0 16px 36px -10px rgba(185, 28, 28, 0.25), 0 8px 16px rgba(0, 0, 0, 0.08);
          max-width: 880px;
          margin: 0 auto;
        }

        .ticket-body {
          background-color: #fffdfa;
          border-radius: 18px;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .ticket-photo-col {
          width: 240px;
          flex-shrink: 0;
          position: relative;
        }

        .ticket-photo-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 4px 8px;
          border-radius: 6px;
        }

        .ticket-center-col {
          flex: 1 1 auto;
          padding: 20px 24px;
          min-width: 0;
        }

        .ticket-details-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px 14px;
          margin-bottom: 10px;
          background-color: #f8fafc;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .detail-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          display: block;
        }

        .detail-value {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ticket-pills-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .ticket-pill {
          background-color: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #334155;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 8px;
        }

        .ticket-action-pill {
          display: inline-block;
          background-color: #b91c1c;
          color: #ffffff;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 5px 14px;
          border-radius: 100px;
          letter-spacing: 0.02em;
        }

        /* Perforation with semi-circle cutouts */
        .ticket-perforation-divider {
          width: 32px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }

        .ticket-notch {
          width: 24px;
          height: 12px;
          background-color: #f1f5f9;
        }

        .notch-top {
          border-bottom-left-radius: 24px;
          border-bottom-right-radius: 24px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .notch-bottom {
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.08);
        }

        .ticket-dashed-line {
          width: 0;
          height: 100%;
          border-left: 2px dashed #cbd5e1;
          margin: 6px 0;
        }

        .ticket-stub-col {
          width: 200px;
          flex-shrink: 0;
          padding: 18px 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          text-align: center;
          background-color: #fafaf9;
        }

        .stub-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 6px;
        }

        .stub-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .stub-number {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }

        .stub-qr-container {
          background-color: #ffffff;
          padding: 6px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .stub-scan-caption {
          font-size: 0.62rem;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .stub-barcode-wrap {
          width: 100%;
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .barcode-svg {
          width: 140px;
          height: 22px;
          display: block;
        }

        .barcode-number {
          font-family: monospace;
          font-size: 0.62rem;
          color: #94a3b8;
          margin-top: 2px;
          letter-spacing: 0.05em;
        }

        /* Mobile Responsive View */
        @media (max-width: 767px) {
          .ticket-body {
            flex-direction: column;
          }

          .ticket-photo-col {
            width: 100%;
            height: 140px;
          }

          .ticket-center-col {
            padding: 16px;
          }

          .ticket-perforation-divider {
            width: 100%;
            height: 28px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .ticket-notch {
            width: 14px;
            height: 28px;
          }

          .notch-top {
            border-top-right-radius: 28px;
            border-bottom-right-radius: 28px;
            border-bottom-left-radius: 0;
          }

          .notch-bottom {
            border-top-left-radius: 28px;
            border-bottom-left-radius: 28px;
            border-top-right-radius: 0;
          }

          .ticket-dashed-line {
            width: 100%;
            height: 0;
            border-left: none;
            border-top: 2px dashed #cbd5e1;
            margin: 0 8px;
          }

          .ticket-stub-col {
            width: 100%;
            padding: 18px 16px;
          }
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .ticket-page-root {
            background-color: transparent !important;
            padding: 0 !important;
          }
          .ticket-frame {
            box-shadow: none !important;
            border: 2px solid #b91c1c !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
