
import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Hero />
      <Gallery />
      <ContactForm />
      <Services />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
