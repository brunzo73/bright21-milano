
import React from 'react';
import { Wifi, ShowerHead, MapPin, Plane, Key, BedDouble } from 'lucide-react';

const services = [
  {
    icon: Wifi,
    title: 'High-speed fiber WiFi',
    description: 'Unlimited high-speed internet connection for work and entertainment'
  },
  {
    icon: ShowerHead,
    title: 'Spacious shower',
    description: 'Large bathroom with comfortable shower for maximum relaxation'
  },
  {
    icon: MapPin,
    title: 'Central location',
    description: 'Next to Central Station, in the heart of Milan'
  },
  {
    icon: Plane,
    title: 'Airport connections',
    description: 'Direct metro and bus connections to Malpensa and Linate airports'
  },
  {
    icon: Key,
    title: 'Smart check-in available',
    description: 'Autonomous and flexible arrival, without time constraints'
  },
  {
    icon: BedDouble,
    title: 'Comfortable bed for two people',
    description: 'Comfortable sleeping area for perfect rest'
  }
];

const Services = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Comfort and <span className="text-amber-600">Convenience</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Everything you need for an unforgettable stay in Milan
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 sm:p-8 shadow-lg card-hover border border-amber-100"
            >
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-amber-900" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">
                {service.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
