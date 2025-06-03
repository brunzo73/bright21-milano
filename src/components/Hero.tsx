
import React from 'react';
import { MapPin } from 'lucide-react';

const Hero = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/7353437d-1677-46df-af2a-f9e3936200c6.png" 
          alt="Bright 21 Central Station apartment interior" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/60 to-yellow-900/40"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-3 sm:px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="text-amber-200 text-3xl sm:text-4xl md:text-5xl">Milan Central Station Apartment Short-term Rentals</span><br />
          </h1>
          
          <div className="flex items-center justify-center mb-6 sm:mb-8 text-amber-200">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <span className="text-lg sm:text-xl md:text-2xl">Via Sammartini 21</span>
          </div>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-2">
            Bright 32 sqm apartment on the third floor, with four windows providing natural light all day. Strategic location to explore Milan or for business stays!
          </p>
          
          <button onClick={scrollToContact} className="btn-primary text-base sm:text-lg md:text-xl px-6 sm:px-8">
            Check Availability Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
