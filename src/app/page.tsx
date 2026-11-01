'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import QuickPriceCheck from '@/components/QuickPriceCheck';
import TrustStrip from '@/components/TrustStrip';
import About from '@/components/About';
import Facilities from '@/components/Facilities';
import PrivateExperience from '@/components/PrivateExperience';
import Celebrations from '@/components/Celebrations';
import Gallery from '@/components/Gallery';
import HowBookingWorks from '@/components/HowBookingWorks';
import AvailabilitySection from '@/components/AvailabilitySection';
import FAQSection from '@/components/FAQSection';
import LocationSection from '@/components/LocationSection';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import StickyMobileBar from '@/components/StickyMobileBar';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BookingModal from '@/components/BookingModal';

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBookingDate, setSelectedBookingDate] = useState<string | null>(null);

  const scrollToAvailability = () => {
    const el = document.getElementById('availability');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (date?: string | null) => {
    if (date) {
      setSelectedBookingDate(date);
    }
    setIsBookingOpen(true);
  };

  const handleSelectDateFromCalendar = (dateStr: string) => {
    setSelectedBookingDate(dateStr);
    setIsBookingOpen(true);
  };

  return (
    <main>
      {/* 1. Header */}
      <Header onOpenBooking={() => handleOpenBooking(null)} />

      {/* 2. Hero with Floating Price Bubble & Badges */}
      <Hero
        onCheckAvailability={scrollToAvailability}
        onBookNow={() => handleOpenBooking(null)}
      />

      {/* 3. Quick Price & Date Availability Strip */}
      <QuickPriceCheck
        onCheckDate={(date) => handleOpenBooking(date)}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* 4. Quick Value Strip (ONE BOOKING. ONE DAY. YOUR PRIVATE PLACE.) */}
      <TrustStrip />

      {/* 5. About (A DAY MADE FOR YOUR PEOPLE) */}
      <About />

      {/* 6. Facilities (8 Unique Visuals - Zero Reused Images) */}
      <Facilities />

      {/* 7. Private Full-Day Experience (THE WHOLE PLACE. JUST FOR YOUR GROUP.) */}
      <PrivateExperience onCheckDate={scrollToAvailability} />

      {/* 8. Birthday / Celebration (MAKE THEIR DAY EXTRA SPECIAL 🎉) */}
      <Celebrations onCheckAvailability={scrollToAvailability} />

      {/* 9. Fun Photo Gallery */}
      <Gallery />

      {/* 10. How Booking Works (6-Step Visual Stepper) */}
      <HowBookingWorks />

      {/* 11. Availability Calendar (PICK YOUR DAY) */}
      <AvailabilitySection onSelectDate={handleSelectDateFromCalendar} />

      {/* 12. FAQ Section */}
      <FAQSection />

      {/* 13. Location (FIND US IN PANPOLI 📍 with Google Maps Link) */}
      <LocationSection />

      {/* 14. Final Booking CTA (BOOK YOUR DAY OUT) */}
      <FinalCTA
        onCheckAvailability={scrollToAvailability}
        onBookNow={() => handleOpenBooking(null)}
      />

      {/* 15. Footer with MR.VVM Designer Credit */}
      <Footer />

      {/* Floating Instant WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Sticky Mobile Bottom Booking Bar */}
      <StickyMobileBar
        onCheckAvailability={scrollToAvailability}
        onBookNow={() => handleOpenBooking(null)}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDate={selectedBookingDate}
      />
    </main>
  );
}
