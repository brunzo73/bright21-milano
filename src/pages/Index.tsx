
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import BookingInfo from '../components/BookingInfo';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const Index = () => {
  return (
    <div id="top" className="min-h-screen gradient-bg">
      <Header />
      <Hero />
      <Gallery />
      <Services />
      <BookingInfo />
      <ContactForm />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
