
import React, { useState, useEffect } from 'react';
import { MapPin, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const navigate = useNavigate();
  const [heroImage, setHeroImage] = useState<string>('/lovable-uploads/7353437d-1677-46df-af2a-f9e3936200c6.png');
  const [adminClicks, setAdminClicks] = useState(0);

  useEffect(() => {
    // Fetch hero image from database
    const fetchHeroImage = async () => {
      try {
        const { data, error } = await supabase
          .from('site_images')
          .select('file_path')
          .eq('image_type', 'hero')
          .order('display_order', { ascending: true })
          .limit(1)
          .single();

        if (data && !error) {
          const { data: imageData } = supabase.storage
            .from('admin-images')
            .getPublicUrl(data.file_path);
          setHeroImage(imageData.publicUrl);
        }
      } catch (error) {
        console.log('Using fallback hero image');
      }
    };

    fetchHeroImage();
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleAdminClick = () => {
    console.log('Admin access clicked'); // Debug log
    navigate('/admin-login');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hidden Admin Button */}
      <button
        onClick={handleAdminClick}
        className="absolute top-4 right-4 z-20 w-10 h-10 opacity-0 hover:opacity-30 transition-opacity duration-300 bg-white/10 rounded-full flex items-center justify-center"
        aria-label="Admin Access"
        title="Clicca per accedere all'admin"
      >
        <Settings className="w-6 h-6 text-white" />
      </button>

      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
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
            Bright 32 sqm apartment on the third floor, with four windows providing natural light all day. Strategic location to explore Milan or for business stays.
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
