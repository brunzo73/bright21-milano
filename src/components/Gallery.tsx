
import React from 'react';

const Gallery = () => {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Modern workspace with natural light"
    },
    {
      src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
      alt: "Bright living space"
    },
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
      alt: "Comfortable workspace"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Il Tuo <span className="text-amber-600">Rifugio</span> a Milano
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Scopri gli spazi luminosi e moderni che ti accoglieranno durante il tuo soggiorno
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="card-hover rounded-xl overflow-hidden shadow-lg">
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Quattro finestre per la massima luminosità
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Goditi la luce naturale che filtra tutto il giorno attraverso le ampie finestre, 
              creando un'atmosfera calda e accogliente. Il design moderno si fonde perfettamente 
              con il comfort, offrendoti uno spazio ideale per rilassarti dopo aver esplorato Milano.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
