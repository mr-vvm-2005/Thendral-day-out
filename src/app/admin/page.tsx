'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  BookOpen,
  Users,
  FileSpreadsheet,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  IndianRupee,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Camera,
  FileImage,
  Share2,
  MessageCircle,
  Trash2,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';
import { Booking, Customer, SettingData } from '@/lib/types';
import { generateTicketImage, downloadTicketDataUrl } from '@/lib/ticketImage';

export default function AdminPage() {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'bookings' | 'customers' | 'reports' | 'settings'>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // State
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [reportsData, setReportsData] = useState<any>(null);
  const [settings, setSettings] = useState<SettingData | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [ticketModalBooking, setTicketModalBooking] = useState<Booking | null>(null);
  const [ticketImagePreview, setTicketImagePreview] = useState<string | null>(null);
  const [generatingTicket, setGeneratingTicket] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form states for manual booking
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formPaymentStatus, setFormPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'UPI' | 'CASH'>('UPI');
  const [formPaymentRef, setFormPaymentRef] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [createSubmitting, setCreateSubmitting] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Calendar tab date navigation
  const [calDate, setCalDate] = useState(new Date());

  // Check auth & fetch data
  const loadData = async () => {
    try {
      setLoading(true);

      // Verify Session
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meRes.ok || !meData.authenticated) {
        router.push('/admin/login');
        return;
      }

      // Fetch Bookings
      const bRes = await fetch('/api/admin/bookings');
      const bData = await bRes.json();
      if (bData.success) setBookings(bData.bookings || []);

      // Fetch Customers
      const cRes = await fetch('/api/admin/customers');
      const cData = await cRes.json();
      if (cData.success) setCustomers(cData.customers || []);

      // Fetch Reports
      const rRes = await fetch('/api/admin/reports');
      const rData = await rRes.json();
      if (rData.success) setReportsData(rData);

      // Fetch Settings
      const sRes = await fetch('/api/admin/settings');
      const sData = await sRes.json();
      if (sData.success) setSettings(sData.settings);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formPhone.trim() || !formDate) {
      setFormError('Please fill in Customer Name, Mobile Number, and Date.');
      return;
    }

    try {
      setCreateSubmitting(true);
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formName.trim(),
          customer_phone: formPhone.trim(),
          booking_date: formDate,
          amount: 3000,
          payment_status: formPaymentStatus,
          payment_method: formPaymentMethod,
          payment_reference: formPaymentRef.trim(),
          notes: formNotes.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || 'Failed to create booking.');
        return;
      }

      setIsCreateModalOpen(false);
      // Reset form
      setFormName('');
      setFormPhone('');
      setFormDate('');
      setFormPaymentRef('');
      setFormNotes('');
      // Reload updated records
      await loadData();

      // Automatically open the generated E-Ticket modal for immediate image download
      if (data.booking) {
        openTicketImageModal(data.booking);
      }
    } catch {
      setFormError('Network error while creating booking.');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openTicketImageModal = async (booking: Booking) => {
    setTicketModalBooking(booking);
    setTicketImagePreview(null);
    setGeneratingTicket(true);
    try {
      // First attempt to get the exact QR code from the ticket endpoint
      let qrCodeUrl: string | undefined;
      try {
        const ticketRes = await fetch(`/api/ticket?id=${booking.booking_id}`);
        const ticketData = await ticketRes.json();
        if (ticketData.success && ticketData.ticket?.qr_code) {
          qrCodeUrl = ticketData.ticket.qr_code;
        }
      } catch (e) {
        console.warn('Could not fetch ticket endpoint for QR code:', e);
      }

      const imgDataUrl = await generateTicketImage({
        bookingId: booking.booking_id,
        customerName: booking.customer_name,
        customerPhone: booking.customer_phone,
        bookingDate: booking.booking_date,
        amount: booking.amount,
        bookingStatus: booking.booking_status,
        paymentStatus: booking.payment_status,
        paymentMethod: booking.payment_method,
        paymentReference: booking.payment_reference,
        qrCodeUrl,
        verifyUrl: `https://thendraldayout.com/verify/${booking.booking_id}`,
        location: settings?.location,
        phone: settings?.phone,
      });

      setTicketImagePreview(imgDataUrl);
    } catch (err) {
      console.error('Failed to generate ticket image:', err);
    } finally {
      setGeneratingTicket(false);
    }
  };

  const handleDownloadTicketImage = () => {
    if (!ticketImagePreview || !ticketModalBooking) return;
    downloadTicketDataUrl(ticketImagePreview, ticketModalBooking.booking_id, ticketModalBooking.customer_name);
  };

  const handleSendTicketWhatsApp = (booking: Booking) => {
    const cleanPhone = booking.customer_phone.replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const msg = `Hello ${booking.customer_name}! 🎉\n\nYour private full-day booking at *THENDRAL DAY OUT* is confirmed!\n\n📋 *Booking ID:* ${booking.booking_id}\n📅 *Date:* ${booking.booking_date} (09:00 AM – 06:00 PM)\n💰 *Amount:* ₹${booking.amount} (${booking.payment_status})\n📍 *Location:* Near Panpoli Thaika Bus Stop, Panpoli, Tenkasi\n\n🎟️ *View & Download your Digital Ticket:* https://thendraldayout.com/ticket/${booking.booking_id}\n\nWe look forward to welcoming you and your family!`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        await loadData();
        if (selectedBookingForDetails && selectedBookingForDetails.id === bookingId) {
          setSelectedBookingForDetails(null);
        }
      } else {
        alert(data.error || 'Failed to confirm booking.');
      }
    } catch {
      alert('Error confirming booking.');
    }
  };

  const handleExecuteCancel = async () => {
    if (!bookingToCancel) return;
    try {
      const res = await fetch(`/api/admin/bookings/${bookingToCancel.id}/cancel`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setBookingToCancel(null);
        if (selectedBookingForDetails && selectedBookingForDetails.id === bookingToCancel.id) {
          setSelectedBookingForDetails(null);
        }
        await loadData();
      } else {
        alert(data.error || 'Failed to cancel booking.');
      }
    } catch {
      alert('Error cancelling booking.');
    }
  };

  const handleExecuteReset = async () => {
    try {
      setResetting(true);
      const res = await fetch('/api/admin/bookings/reset', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setIsResetModalOpen(false);
        await loadData();
        alert(data.message || 'All bookings and history have been cleared. Confirmed revenue is now ₹0.');
      } else {
        alert(data.error || 'Failed to reset bookings.');
      }
    } catch {
      alert('Network error while resetting history.');
    } finally {
      setResetting(false);
    }
  };

  const handleExecuteDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/bookings/${bookingToDelete.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        const deletedId = bookingToDelete.id;
        setBookingToDelete(null);
        if (selectedBookingForDetails?.id === deletedId) {
          setSelectedBookingForDetails(null);
        }
        setSelectedBookingIds((prev) => prev.filter((id) => id !== deletedId));
        await loadData();
      } else {
        alert(data.error || 'Failed to delete booking.');
      }
    } catch {
      alert('Error deleting booking.');
    } finally {
      setDeleting(false);
    }
  };

  const handleExecuteDeleteSelected = async () => {
    if (selectedBookingIds.length === 0) return;
    try {
      setDeleting(true);
      for (const id of selectedBookingIds) {
        await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' });
      }
      setIsDeletingMultiple(false);
      setSelectedBookingIds([]);
      await loadData();
      alert('Selected bookings deleted successfully.');
    } catch {
      alert('Error deleting selected bookings.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
            Loading Thendral Day Out Admin Portal...
          </div>
        </div>
      </div>
    );
  }

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.booking_status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      b.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customer_phone.includes(searchQuery) ||
      b.booking_date.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const overview = reportsData?.overview || {};

  return (
    <div className="admin-layout-root" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', color: 'var(--text-primary)' }}>
      {/* Mobile Top App Bar */}
      <div className="admin-mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="Toggle navigation drawer"
          >
            {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              padding: '2px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Image src="/images/logo.png" alt="Logo" width={28} height={28} style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                THENDRAL DAY OUT
              </div>
              <div style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                Admin Portal
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-sm"
          style={{ backgroundColor: 'var(--accent-green)', color: '#ffffff', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}
        >
          <Plus size={15} />
          <span>New</span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(3, 20, 36, 0.72)',
            backdropFilter: 'blur(4px)',
            zIndex: 95,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isMobileNavOpen ? 'mobile-open' : ''}`}
        style={{
          width: '260px',
          backgroundColor: '#071d2f',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Brand */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                padding: '2px',
                overflow: 'hidden',
              }}>
                <Image src="/images/logo.png" alt="Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 800 }}>
                  THENDRAL DAY OUT
                </div>
                <div style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700, textTransform: 'uppercase' }}>
                  Admin Portal
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="admin-sidebar-close-btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '6px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
          {[
            { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={18} /> },
            { id: 'bookings', label: 'Bookings', icon: <BookOpen size={18} /> },
            { id: 'customers', label: 'Customers', icon: <Users size={18} /> },
            { id: 'reports', label: 'Reports & Revenue', icon: <FileSpreadsheet size={18} /> },
            { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setIsMobileNavOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: isActive ? '#ffffff' : '#94a3b8',
                  backgroundColor: isActive ? 'var(--primary-blue)' : 'transparent',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: '#38bdf8',
              fontWeight: 600,
            }}
          >
            <ExternalLink size={15} />
            <span>View Public Website</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              color: '#f87171',
              fontWeight: 600,
              padding: '8px 0',
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-area" style={{ flexGrow: 1, overflowY: 'auto', padding: '32px' }}>
        {/* Top bar with quick Create Booking button */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '28px',
        }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
              {activeTab === 'overview' && 'Operations Dashboard'}
              {activeTab === 'calendar' && 'Availability Calendar'}
              {activeTab === 'bookings' && 'Booking Management'}
              {activeTab === 'customers' && 'Customer Profiles'}
              {activeTab === 'reports' && 'Revenue & Reports'}
              {activeTab === 'settings' && 'Venue Settings'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Full-day private reservations for Panpoli, Tenkasi venue
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="btn btn-sm"
              style={{
                backgroundColor: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #fecdd3',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
              title="Clear all bookings, history, and reset revenue to ₹0"
            >
              <RotateCcw size={15} />
              <span>Reset History (₹0)</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: 'var(--accent-green)' }}
            >
              <Plus size={16} />
              <span>Create New Booking</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            {/* Overview Stat Cards (Section 16) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}>
              {/* Total Bookings */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Bookings
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginTop: '4px' }}>
                  {overview.totalBookings || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {overview.confirmedCount || 0} Confirmed • {overview.pendingCount || 0} Pending
                </div>
              </div>

              {/* This Month Bookings */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  This Month
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-blue)', marginTop: '4px' }}>
                  {overview.thisMonthBookingsCount || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Revenue: ₹{(overview.thisMonthRevenue || 0).toLocaleString()}
                </div>
              </div>

              {/* Upcoming Bookings */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Upcoming Bookings
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
                  {overview.upcomingCount || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Future confirmed reservations
                </div>
              </div>

              {/* Confirmed Revenue */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Confirmed Revenue
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)', marginTop: '4px' }}>
                  ₹{(overview.confirmedRevenue || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Paid bookings × ₹3,000 (Excl. Cancelled)
                </div>
              </div>

              {/* Cancelled Bookings */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Cancelled Bookings
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                  {overview.cancelledCount || 0}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Freed dates in database
                </div>
              </div>
            </div>

            {/* Today's Booking Section */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '32px',
            }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginBottom: '14px' }}>
                Today&apos;s Booking
              </h2>
              {overview.todaysBooking ? (
                <div style={{
                  backgroundColor: 'var(--accent-green-soft)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-green-dark)', textTransform: 'uppercase' }}>
                      Active Today • {overview.todaysBooking.booking_id}
                    </span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                      {overview.todaysBooking.customer_name} ({overview.todaysBooking.customer_phone})
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {overview.todaysBooking.notes || 'Full-Day exclusive venue use'}
                    </div>
                  </div>
                  <Link
                    href={`/ticket/${overview.todaysBooking.booking_id}`}
                    target="_blank"
                    className="btn btn-primary btn-sm"
                  >
                    <Eye size={15} />
                    <span>View Ticket</span>
                  </Link>
                </div>
              ) : (
                <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', padding: '12px 0' }}>
                  No confirmed booking scheduled for today ({new Date().toISOString().slice(0, 10)}). The venue is currently open.
                </div>
              )}
            </div>

            {/* Recent Bookings Table preview */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  Recent Reservations
                </h2>
                <button
                  onClick={() => setActiveTab('bookings')}
                  style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-blue)' }}
                >
                  View All ({bookings.length}) →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Booking ID</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Customer</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Date</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Amount</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Status</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 700, fontFamily: 'monospace' }}>
                          {b.booking_id}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 600 }}>{b.customer_name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.customer_phone}</div>
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                          {b.booking_date}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--accent-green)' }}>
                          ₹{b.amount.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className={`status-badge ${b.booking_status.toLowerCase()}`}>
                            {b.booking_status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedBookingForDetails(b)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--primary-blue-soft)',
                                color: 'var(--primary-blue)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                              }}
                            >
                              Details
                            </button>
                            <button
                              onClick={() => openTicketImageModal(b)}
                              title="Generate & Download E-Ticket Image"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--accent-green-soft)',
                                color: 'var(--accent-green-dark)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                border: '1px solid #86efac',
                              }}
                            >
                              <FileImage size={14} />
                              <span>E-Ticket</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CALENDAR (Section 17) */}
        {activeTab === 'calendar' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  {calDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1))}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1))}
                    style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-available)' }}>🟢 Available</span>
                <span style={{ color: 'var(--color-booked)' }}>🔴 Booked</span>
                <span style={{ color: 'var(--color-pending)' }}>🟡 Pending</span>
                <span style={{ color: 'var(--text-muted)' }}>⚪ Past Date</span>
              </div>
            </div>

            {/* Grid */}
            <div className="calendar-grid" style={{ marginBottom: '8px' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="calendar-day-header">{d}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {Array.from({ length: new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
              ))}

              {Array.from({ length: new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                const day = i + 1;
                const m = String(calDate.getMonth() + 1).padStart(2, '0');
                const d = String(day).padStart(2, '0');
                const dateStr = `${calDate.getFullYear()}-${m}-${d}`;

                const cellDate = new Date(`${dateStr}T00:00:00`);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const isPast = cellDate < today;
                const booking = bookings.find((b) => b.booking_date === dateStr && b.booking_status !== 'CANCELLED');

                let statusClass = 'available';
                if (isPast) {
                  statusClass = 'past';
                } else if (booking) {
                  statusClass = booking.booking_status.toLowerCase();
                }

                return (
                  <div
                    key={day}
                    onClick={() => {
                      if (booking) setSelectedBookingForDetails(booking);
                    }}
                    className={`calendar-day-cell ${statusClass}`}
                    style={{
                      cursor: booking ? 'pointer' : 'default',
                      minHeight: '80px',
                      padding: '6px',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <span style={{ fontWeight: 800 }}>{day}</span>
                    {booking && (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '0.7rem',
                        backgroundColor: '#ffffff',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 700,
                      }}>
                        {booking.customer_name.split(' ')[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS (Full Management) */}
        {activeTab === 'bookings' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            {/* Filter toolbar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone, or date..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Status Tabs & Clear History */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {selectedBookingIds.length > 0 && (
                  <button
                    onClick={() => setIsDeletingMultiple(true)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
                    }}
                  >
                    <Trash2 size={14} />
                    <span>Delete Selected ({selectedBookingIds.length})</span>
                  </button>
                )}

                <div style={{ display: 'flex', gap: '6px' }}>
                  {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        backgroundColor: statusFilter === st ? 'var(--primary-blue)' : '#f1f5f9',
                        color: statusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsResetModalOpen(true)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: '#fff1f2',
                    color: '#e11d48',
                    border: '1px solid #fecdd3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    padding: '6px 12px',
                  }}
                  title="Clear all bookings and reset revenue to ₹0"
                >
                  <Trash2 size={14} />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={filteredBookings.length > 0 && selectedBookingIds.length === filteredBookings.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBookingIds(filteredBookings.map((b) => b.id));
                          } else {
                            setSelectedBookingIds([]);
                          }
                        }}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        title="Select All"
                      />
                    </th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Booking ID</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Customer Name</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Phone</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Reserved Date</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Amount</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Payment</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No bookings match your current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: selectedBookingIds.includes(b.id) ? '#fef2f2' : 'transparent' }}>
                        <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                          <input
                            type="checkbox"
                            checked={selectedBookingIds.includes(b.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              setSelectedBookingIds((prev) =>
                                prev.includes(b.id) ? prev.filter((x) => x !== b.id) : [...prev, b.id]
                              );
                            }}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, fontFamily: 'monospace' }}>
                          {b.booking_id}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                          {b.customer_name}
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>
                          {b.customer_phone}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                          {b.booking_date}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--accent-green)' }}>
                          ₹{b.amount.toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: b.payment_status === 'PAID' ? '#dcfce7' : '#fef3c7',
                            color: b.payment_status === 'PAID' ? '#15803d' : '#b45309',
                          }}>
                            {b.payment_status} ({b.payment_method})
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className={`status-badge ${b.booking_status.toLowerCase()}`}>
                            {b.booking_status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setSelectedBookingForDetails(b)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--primary-blue-soft)',
                                color: 'var(--primary-blue)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                              }}
                            >
                              Manage
                            </button>
                            <button
                              onClick={() => openTicketImageModal(b)}
                              title="Generate & Download E-Ticket Image"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--accent-green-soft)',
                                color: 'var(--accent-green-dark)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                border: '1px solid #86efac',
                              }}
                            >
                              <FileImage size={13} />
                              <span>E-Ticket</span>
                            </button>
                            {b.booking_status === 'CONFIRMED' && (
                              <Link
                                href={`/ticket/${b.booking_id}`}
                                target="_blank"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                }}
                              >
                                Ticket
                              </Link>
                            )}
                            <button
                              onClick={() => setBookingToDelete(b)}
                              title="Delete this booking permanently"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                backgroundColor: '#fff1f2',
                                color: '#e11d48',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                border: '1px solid #fecdd3',
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS (Section 19) */}
        {activeTab === 'customers' && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                Registered Customer Directory ({customers.length})
              </h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Customer Name</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Mobile Number</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Confirmed Bookings</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Cancelled</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Total Confirmed Amount</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Customer Type</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c: any) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700 }}>{c.name}</td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-secondary)' }}>{c.phone}</td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--accent-green)' }}>
                        {c.confirmed_bookings || c.total_bookings}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#dc2626' }}>
                        {c.cancelled_bookings || 0}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                        ₹{(c.total_confirmed_amount || c.total_spent || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {c.total_bookings > 1 ? (
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                            ⭐ Repeat Customer
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            First-Time Visitor
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & REVENUE (Section 21) */}
        {activeTab === 'reports' && (
          <div>
            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#fff1f2',
                  color: '#e11d48',
                  border: '1px solid #fecdd3',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                }}
                title="Clear all booking history and reset confirmed revenue to ₹0"
              >
                <Trash2 size={16} />
                <span>Reset Revenue to ₹0</span>
              </button>

              <a
                href="/api/admin/reports?format=csv"
                download
                className="btn btn-secondary btn-sm"
              >
                <Download size={16} />
                <span>Export Bookings to CSV</span>
              </a>
            </div>

            {/* Monthly Breakdown Table */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  Monthly Revenue Performance
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Only confirmed paid bookings (₹3,000 / day) are included in confirmed revenue.
                </p>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Month</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Confirmed Bookings</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Cancelled</th>
                      <th style={{ padding: '12px 20px', fontWeight: 700 }}>Confirmed Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportsData?.monthlyBreakdown?.map((m: any) => (
                      <tr key={m.month} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 700 }}>{m.month}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{m.confirmed}</td>
                        <td style={{ padding: '14px 20px', color: '#dc2626' }}>{m.cancelled}</td>
                        <td style={{ padding: '14px 20px', fontWeight: 800, color: 'var(--accent-green)' }}>
                          ₹{m.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '32px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)', maxWidth: '720px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginBottom: '8px' }}>
              Venue Operational Settings
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Core settings and contact channels for Thendral Day Out
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Business Name</label>
                <input
                  type="text"
                  disabled
                  value={settings.business_name}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: '#f1f5f9' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Verified Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>UPI ID for Payment Confirmation</label>
                <input
                  type="text"
                  value={settings.upi_id}
                  onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Fixed Full-Day Price (₹)</label>
                <input
                  type="number"
                  disabled
                  value={settings.price}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: '#f1f5f9', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>Venue Address</label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={async () => {
                    await fetch('/api/admin/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(settings),
                    });
                    alert('Settings updated successfully!');
                  }}
                  className="btn btn-primary"
                >
                  Save Settings
                </button>
              </div>
            </div>

            {/* Danger Zone: Reset Bookings & Revenue */}
            <div style={{
              marginTop: '32px',
              backgroundColor: '#fff1f2',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #fecdd3',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0,
                }}>
                  <AlertTriangle size={22} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#991b1b', marginBottom: '4px' }}>
                    Danger Zone: Reset All Bookings & Revenue
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#7f1d1d', lineHeight: '1.5', marginBottom: '16px' }}>
                    Permanently delete all customer bookings, clear booking history, unreserve all dates on the availability calendar, and reset confirmed revenue to ₹0.
                  </p>
                  <button
                    onClick={() => setIsResetModalOpen(true)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontWeight: 700,
                      padding: '10px 18px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '10px',
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Clear All Bookings & Make ₹0 Revenue</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE MANUAL BOOKING (Section 18) */}
        {isCreateModalOpen && (
          <div
            onClick={() => setIsCreateModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(7, 27, 44, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '520px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              }}
            >
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginBottom: '4px' }}>
                Admin: Create New Booking
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Server checks date availability to prevent double bookings.
              </p>

              {formError && (
                <div style={{ padding: '10px 14px', backgroundColor: 'var(--color-booked-bg)', color: '#991b1b', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateBooking}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Kumar"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9840123456"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Booking Date *</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Amount</label>
                    <input
                      type="text"
                      disabled
                      value="₹3,000 (Full Day)"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: '#f1f5f9', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Payment Status</label>
                    <select
                      value={formPaymentStatus}
                      onChange={(e) => setFormPaymentStatus(e.target.value as any)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>UPI Reference / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/261029/7741 or GooglePay"
                    value={formPaymentRef}
                    onChange={(e) => setFormPaymentRef(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createSubmitting}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    {createSubmitting ? 'Verifying...' : 'Create Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: BOOKING DETAILS (Section 17) */}
        {selectedBookingForDetails && (
          <div
            onClick={() => setSelectedBookingForDetails(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(7, 27, 44, 0.7)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '520px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className={`status-badge ${selectedBookingForDetails.booking_status.toLowerCase()}`}>
                  {selectedBookingForDetails.booking_status}
                </span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary-blue-dark)' }}>
                  {selectedBookingForDetails.booking_id}
                </span>
              </div>

              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginBottom: '4px' }}>
                {selectedBookingForDetails.customer_name}
              </h2>
              <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                📞 {selectedBookingForDetails.customer_phone}
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Booking Date:</span>
                  <span style={{ fontWeight: 700 }}>{selectedBookingForDetails.booking_date} (Full Day)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-green)' }}>₹{selectedBookingForDetails.amount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
                  <span style={{ fontWeight: 700 }}>{selectedBookingForDetails.payment_status} ({selectedBookingForDetails.payment_method})</span>
                </div>
                {selectedBookingForDetails.payment_reference && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Reference:</span>
                    <span>{selectedBookingForDetails.payment_reference}</span>
                  </div>
                )}
                {selectedBookingForDetails.notes && (
                  <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', color: 'var(--text-secondary)' }}>
                    <strong>Notes:</strong> {selectedBookingForDetails.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => {
                    openTicketImageModal(selectedBookingForDetails);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', backgroundColor: 'var(--accent-green)' }}
                >
                  <FileImage size={16} />
                  <span>Generate & Download E-Ticket Image (PNG)</span>
                </button>

                {selectedBookingForDetails.booking_status === 'CONFIRMED' && (
                  <Link
                    href={`/ticket/${selectedBookingForDetails.booking_id}`}
                    target="_blank"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Eye size={16} />
                    <span>View Public Ticket Page</span>
                  </Link>
                )}

                {selectedBookingForDetails.booking_status === 'PENDING' && (
                  <button
                    onClick={() => handleConfirmBooking(selectedBookingForDetails.id)}
                    className="btn btn-primary"
                    style={{ width: '100%', backgroundColor: 'var(--accent-green)' }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Confirm Booking & Activate Ticket</span>
                  </button>
                )}

                {selectedBookingForDetails.booking_status !== 'CANCELLED' && (
                  <button
                    onClick={() => {
                      setBookingToCancel(selectedBookingForDetails);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-full)',
                      color: '#b45309',
                      border: '1.5px solid #fde68a',
                      backgroundColor: '#fffbeb',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    Cancel Booking
                  </button>
                )}

                <button
                  onClick={() => {
                    setBookingToDelete(selectedBookingForDetails);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-full)',
                    color: '#dc2626',
                    border: '1.5px solid #fecaca',
                    backgroundColor: '#fff1f2',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Trash2 size={16} />
                  <span>Delete Booking Permanently</span>
                </button>

                <button
                  onClick={() => setSelectedBookingForDetails(null)}
                  style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '0.88rem' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CANCELLATION CONFIRMATION (Section 20) */}
        {bookingToCancel && (
          <div
            onClick={() => setBookingToCancel(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              backgroundColor: 'rgba(7, 27, 44, 0.75)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                maxWidth: '460px',
                width: '100%',
                padding: '28px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-booked-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}>
                <AlertTriangle size={32} color="#dc2626" />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-blue-dark)', marginBottom: '8px' }}>
                Are you sure you want to cancel this booking?
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                Cancelling booking <strong>{bookingToCancel.booking_id}</strong> for <strong>{bookingToCancel.booking_date}</strong> will make the date available again on the public calendar. The cancellation will be permanently preserved in reports.
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setBookingToCancel(null)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleExecuteCancel}
                  className="btn btn-primary"
                  style={{ flex: 1, backgroundColor: '#dc2626' }}
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: E-TICKET GENERATOR & IMAGE DOWNLOAD */}
        {ticketModalBooking && (
          <div
            onClick={() => {
              setTicketModalBooking(null);
              setTicketImagePreview(null);
            }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 120,
              backgroundColor: 'rgba(7, 27, 44, 0.8)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '620px',
                width: '100%',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
                border: '2px solid var(--border-playful)',
              }}
            >
              {/* Modal Header */}
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileImage size={20} color="var(--primary-blue)" />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-blue-dark)', margin: 0 }}>
                      Official E-Ticket Generator
                    </h2>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {ticketModalBooking.customer_name} • {ticketModalBooking.booking_id}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setTicketModalBooking(null);
                    setTicketImagePreview(null);
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#64748b',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body / Image Preview */}
              <div style={{
                padding: '20px 24px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: '#f1f5f9',
              }}>
                {generatingTicket && (
                  <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <RefreshCw size={36} color="var(--primary-blue)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-blue-dark)' }}>
                      Generating High-Resolution E-Ticket Image...
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Rendering official venue logo, QR verification token, and booking details
                    </div>
                  </div>
                )}

                {!generatingTicket && ticketImagePreview && (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: '100%',
                      maxHeight: '440px',
                      overflowY: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      border: '2px solid #bae6fd',
                      backgroundColor: '#ffffff',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ticketImagePreview}
                        alt="E-Ticket Preview"
                        style={{ width: '100%', display: 'block', height: 'auto' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
                      High-resolution PNG image (960 × 1380 px) ready for download or sharing
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer / Download Actions */}
              <div style={{
                padding: '18px 24px',
                borderTop: '1px solid var(--border-light)',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}>
                <button
                  onClick={handleDownloadTicketImage}
                  disabled={generatingTicket || !ticketImagePreview}
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--accent-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <Download size={20} />
                  <span>Download E-Ticket Image (PNG)</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleSendTicketWhatsApp(ticketModalBooking)}
                    className="btn btn-whatsapp"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <MessageCircle size={18} />
                    <span>Send via WhatsApp</span>
                  </button>

                  <Link
                    href={`/ticket/${ticketModalBooking.booking_id}`}
                    target="_blank"
                    className="btn btn-outline"
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <ExternalLink size={16} />
                    <span>Open Ticket Page</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: RESET / CLEAR ALL BOOKINGS & REVENUE */}
        {isResetModalOpen && (
          <div
            onClick={() => !resetting && setIsResetModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              backgroundColor: 'rgba(7, 27, 44, 0.75)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '520px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #fee2e2',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '24px',
                backgroundColor: '#fff1f2',
                borderBottom: '1px solid #fecdd3',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0,
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                    Clear All Bookings & History?
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#b91c1c', margin: '4px 0 0 0' }}>
                    Reset all records and set confirmed revenue to ₹0
                  </p>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                  Are you sure you want to delete all bookings and previous customer history?
                </p>

                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--border-light)',
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Total Bookings:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{bookings.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Customer Profiles:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{customers.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Confirmed Revenue:</span>
                    <span style={{ fontWeight: 800, color: 'var(--accent-green)' }}>
                      ₹{reportsData?.overview?.confirmedRevenue ? Number(reportsData.overview.confirmedRevenue).toLocaleString() : '0'}
                    </span>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#fffbeb',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid #fef3c7',
                  fontSize: '0.84rem',
                  color: '#92400e',
                  lineHeight: '1.5',
                }}>
                  ⚠️ <strong>Consequences of this action:</strong>
                  <ul style={{ margin: '8px 0 0 18px', padding: 0 }}>
                    <li>All booking records and tickets will be permanently deleted.</li>
                    <li>Confirmed revenue will immediately drop to <strong>₹0</strong>.</li>
                    <li>All calendar dates will be unreserved and available again.</li>
                    <li>This action cannot be undone.</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                padding: '18px 24px',
                borderTop: '1px solid var(--border-light)',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}>
                <button
                  type="button"
                  disabled={resetting}
                  onClick={() => setIsResetModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ padding: '10px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={resetting}
                  onClick={handleExecuteReset}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '10px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderRadius: '10px',
                  }}
                >
                  {resetting ? (
                    <>
                      <RotateCcw size={16} />
                      <span>Clearing All Data...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      <span>Yes, Clear All & Make ₹0 Revenue</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL: DELETE INDIVIDUAL BOOKING */}
        {bookingToDelete && (
          <div
            onClick={() => !deleting && setBookingToDelete(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              backgroundColor: 'rgba(7, 27, 44, 0.75)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '480px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #fee2e2',
              }}
            >
              <div style={{
                padding: '20px 24px',
                backgroundColor: '#fff1f2',
                borderBottom: '1px solid #fecdd3',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0,
                }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                    Delete Booking?
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#b91c1c', margin: '2px 0 0 0' }}>
                    Permanently delete booking {bookingToDelete.booking_id}
                  </p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                  Are you sure you want to permanently delete this booking?
                </p>

                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid var(--border-light)',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.86rem',
                }}>
                  <div><strong>Booking ID:</strong> <span style={{ fontFamily: 'monospace' }}>{bookingToDelete.booking_id}</span></div>
                  <div><strong>Customer:</strong> {bookingToDelete.customer_name} ({bookingToDelete.customer_phone})</div>
                  <div><strong>Date:</strong> {bookingToDelete.booking_date}</div>
                  <div><strong>Amount:</strong> ₹{bookingToDelete.amount} ({bookingToDelete.payment_status})</div>
                  <div><strong>Status:</strong> {bookingToDelete.booking_status}</div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#b45309', backgroundColor: '#fffbeb', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fef3c7', margin: 0 }}>
                  ⚠️ The date <strong>{bookingToDelete.booking_date}</strong> will immediately become available again for new customers to book.
                </p>
              </div>

              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-light)',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setBookingToDelete(null)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleExecuteDeleteBooking}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '8px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                  }}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE SELECTED BOOKINGS */}
        {isDeletingMultiple && (
          <div
            onClick={() => !deleting && setIsDeletingMultiple(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 110,
              backgroundColor: 'rgba(7, 27, 44, 0.75)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                maxWidth: '480px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid #fee2e2',
              }}
            >
              <div style={{
                padding: '20px 24px',
                backgroundColor: '#fff1f2',
                borderBottom: '1px solid #fecdd3',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0,
                }}>
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                    Delete {selectedBookingIds.length} Selected Bookings?
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#b91c1c', margin: '2px 0 0 0' }}>
                    Permanently delete selected booking records
                  </p>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.5' }}>
                  Are you sure you want to delete these <strong>{selectedBookingIds.length}</strong> selected bookings?
                </p>

                <p style={{ fontSize: '0.82rem', color: '#b45309', backgroundColor: '#fffbeb', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fef3c7', margin: 0 }}>
                  ⚠️ Their reserved dates will become available again on the calendar, and all selected records will be removed.
                </p>
              </div>

              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--border-light)',
                backgroundColor: '#f8fafc',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setIsDeletingMultiple(false)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleExecuteDeleteSelected}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '8px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px',
                  }}
                >
                  {deleting ? 'Deleting...' : `Yes, Delete ${selectedBookingIds.length} Bookings`}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-mobile-topbar {
          display: none;
        }
        .admin-sidebar-close-btn {
          display: none;
        }

        @media (max-width: 1023px) {
          :global(.admin-layout-root) {
            flex-direction: column !important;
          }

          .admin-mobile-topbar {
            display: flex !important;
            position: sticky;
            top: 0;
            z-index: 50;
            background-color: #071d2f;
            color: #ffffff;
            padding: 12px 16px;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
          }

          :global(.admin-sidebar) {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            height: 100dvh !important;
            width: 280px !important;
            max-width: 85vw !important;
            z-index: 100 !important;
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 0 35px rgba(0, 0, 0, 0.6);
            pointer-events: none;
            visibility: hidden;
          }

          :global(.admin-sidebar.mobile-open) {
            transform: translateX(0) !important;
            pointer-events: auto !important;
            visibility: visible !important;
          }

          .admin-sidebar-close-btn {
            display: flex !important;
          }

          :global(.admin-main-area) {
            padding: clamp(14px, 3.5vw, 24px) !important;
            width: 100% !important;
            max-width: 100vw !important;
            overflow-x: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}
