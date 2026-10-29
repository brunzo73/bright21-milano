
import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import BookingInfo from '../components/BookingInfo';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import { CalendarCheck } from 'lucide-react';

const Index = () => {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      <Hero />
      <Gallery />
      <Services />
      <BookingInfo />
      <ContactForm />
      <Footer />
      <Chatbot />

      {/* Sticky booking CTA */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          showSticky ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <a
          href="#contact"
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6 py-3.5 rounded-full shadow-2xl shadow-amber-400/40 hover:scale-105 active:scale-95 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
        >
          <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          Check Availability
        </a>
      </div>
    </div>
  );
};

export default Index;
