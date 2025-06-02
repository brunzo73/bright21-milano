
import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Hero />
      <Services />
      <Gallery />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
