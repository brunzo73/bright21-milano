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
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-amber-200 text-5xl">Milan Central Station Apartment
Short-term Rentals </span><br />
            <span className="text-2xl md:text-4xl font-light"></span>
          </h1>
          
          <div className="flex items-center justify-center mb-8 text-amber-200">
            <MapPin className="w-6 h-6 mr-2" />
            <span className="text-xl md:text-2xl">Via Sammartini 21</span>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-3xl mx-auto">
            Luminoso monolocale di 32 mq al terzo piano, con quattro finestre che offrono luce naturale tutto il giorno. 
            Posizione strategica per esplorare Milano o soggiorni business!
          </p>
          
          <button onClick={scrollToContact} className="btn-primary text-lg md:text-xl">
            Richiedi disponibilità ora
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
