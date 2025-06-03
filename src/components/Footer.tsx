
import React from 'react';
import { MapPin, Wifi, ShowerHead } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 text-amber-400">
              Bright 21 Central Station
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Your bright refuge in the heart of Milan. Modern comfort and strategic location 
              for an unforgettable experience.
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-400">
              Key Features
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-amber-400" />
                Central Station
              </li>
              <li className="flex items-center">
                <Wifi className="w-5 h-5 mr-2 text-amber-400" />
                Fiber Optic WiFi
              </li>
              <li className="flex items-center">
                <ShowerHead className="w-5 h-5 mr-2 text-amber-400" />
                Spacious Bathroom
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-400">
              Contact
            </h4>
            <p className="text-gray-300 mb-2">
              For bookings and information, fill out the contact form above.
            </p>
            <p className="text-gray-300">
              We will respond within 24 hours!
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Bright 21 Central Station. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
