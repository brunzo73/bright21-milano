
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
    title: 'Smart check-in',
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
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Comfort e <span className="text-amber-600">Convenienza</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tutto ciò di cui hai bisogno per un soggiorno indimenticabile a Milano
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-lg card-hover border border-amber-100"
            >
              <div className="bg-gradient-to-br from-amber-400 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
