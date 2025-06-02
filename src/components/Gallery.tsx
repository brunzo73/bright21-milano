
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {
  const images = [
    {
      src: "/lovable-uploads/7353437d-1677-46df-af2a-f9e3936200c6.png",
      alt: "Vista generale del monolocale luminoso"
    },
    {
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Zona cucina moderna e funzionale"
    },
    {
      src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Area relax con divano e TV"
    },
    {
      src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Bagno spazioso con doccia"
    },
    {
      src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Zona notte confortevole"
    },
    {
      src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Cucina attrezzata con tutti i comfort"
    },
    {
      src: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Dettaglio arredamento moderno"
    },
    {
      src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Spazio di lavoro con scrivania"
    },
    {
      src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Vista delle quattro finestre luminose"
    },
    {
      src: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      alt: "Dettagli e comfort dell'appartamento"
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
        
        {/* Galleria principale con carousel */}
        <div className="mb-12">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img 
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Griglia di miniature */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {images.slice(0, 10).map((image, index) => (
            <div key={index} className="card-hover rounded-lg overflow-hidden shadow-md">
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-24 md:h-32 object-cover"
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
