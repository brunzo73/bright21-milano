
import React from 'react';
import { Wifi, ShowerHead, MapPin, Plane, Key, BedDouble } from 'lucide-react';

const services = [
  {
    icon: Wifi,
    title: 'WiFi veloce in fibra',
    description: 'Connessione illimitata ad alta velocità per lavoro e intrattenimento'
  },
  {
    icon: ShowerHead,
    title: 'Ampia doccia',
    description: 'Bagno spazioso con doccia confortevole per il massimo relax'
  },
  {
    icon: MapPin,
    title: 'Posizione centrale',
    description: 'Accanto alla Stazione Centrale, nel cuore pulsante di Milano'
  },
  {
    icon: Plane,
    title: 'Collegamenti aeroportuali',
    description: 'Metro e bus diretti per Malpensa e Linate a pochi passi'
  },
  {
    icon: Key,
    title: 'Possibilità di Smart check-in',
    description: 'Arrivo autonomo e flessibile, senza vincoli di orario'
  },
  {
    icon: BedDouble,
    title: 'Letto comodo per 2',
    description: 'Zona notte confortevole per un riposo perfetto'
  }
];

const Services = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Comfort e <span className="text-amber-600">Convenienza</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Tutto ciò di cui hai bisogno per un soggiorno indimenticabile a Milano
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
