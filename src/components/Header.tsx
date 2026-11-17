import React, { useEffect, useState } from 'react';
import { CalendarCheck } from 'lucide-react';

const NAV_LINKS = [
  { href: '#photos', label: 'Photos' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#how-booking-works', label: 'How Booking Works' },
];

export const LogoMark = ({ className = 'h-9 w-9' }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="b21-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="10" fill="url(#b21-grad)" />
    <text
      x="20"
      y="26.5"
      textAnchor="middle"
      fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
      fontSize="17"
      fontWeight="800"
      fill="#ffffff"
      letterSpacing="-0.5"
    >
      B21
    </text>
  </svg>
);

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 h-16">
        <a href="#top" className="flex items-center gap-2.5 min-w-0" aria-label="Bright 21 Milano — back to top">
          <LogoMark className="h-9 w-9 flex-shrink-0 drop-shadow-sm" />
          <span className="leading-tight min-w-0">
            <span className={`block font-bold text-base sm:text-lg truncate ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Bright 21
            </span>
            <span
              className={`block text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase whitespace-nowrap ${
                scrolled ? 'text-amber-600' : 'text-amber-300'
              }`}
            >
              Milano<span className="hidden sm:inline"> Centrale</span>
            </span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Page sections">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-amber-600' : 'text-white/90 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="flex-shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold text-sm px-4 py-2.5 rounded-full shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
        >
          <CalendarCheck className="w-4 h-4" />
          Check Availability
        </a>
      </div>
    </header>
  );
};

export default Header;
