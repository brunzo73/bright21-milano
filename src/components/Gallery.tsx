
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
    // Immagine principale (copertina) - già utilizzata nell'hero
    {
      src: "/lovable-uploads/7353437d-1677-46df-af2a-f9e3936200c6.png",
      alt: "Monolocale luminoso Milano Stazione Centrale - vista generale appartamento moderno"
    },
    // Camera da letto
    {
      src: "/lovable-uploads/789a1024-dc38-4fff-8ea2-ae0956adffed.png",
      alt: "Camera da letto confortevole Milano - letto matrimoniale con arte di Milano"
    },
    {
      src: "/lovable-uploads/9fdb0a74-dcc3-4ce2-94e4-6f4cb0ba1979.png",
      alt: "Dettagli camera da letto Milano - asciugamani freschi e comfort"
    },
    // Cucina
    {
      src: "/lovable-uploads/61af2c61-70e4-4627-9ac5-581f5e340d7f.png",
      alt: "Cucina moderna Milano Centrale - attrezzata con finestra e tende gialle"
    },
    {
      src: "/lovable-uploads/85376af8-9d1c-49c4-a5c1-1d5fc7801edb.png",
      alt: "Zona pranzo Milano - tavolo per due con vista cucina attrezzata"
    },
    {
      src: "/lovable-uploads/4519b0f4-7471-48e9-8987-b7bb29791f0d.png",
      alt: "Area pranzo luminosa Milano - tavolo moderno vicino Stazione Centrale"
    },
    // Bagno
    {
      src: "/lovable-uploads/e7bda387-e83b-4db6-ae31-2e1e6a7a5561.png",
      alt: "Bagno moderno Milano - doccia spaziosa con box vetro e termoarredo"
    },
    // Esterni e posizione
    {
      src: "/lovable-uploads/55e2504b-5cbf-4165-9e6d-0069d84f92bf.png",
      alt: "Via Sammartini Milano - posizione strategica vicino Stazione Centrale"
    },
    {
      src: "/lovable-uploads/9a1458fa-dac5-4d80-83e1-6394f02c7e57.png",
      alt: "Ingresso palazzo storico Milano - androne elegante Via Sammartini"
    },
    {
      src: "/lovable-uploads/2866d0c7-58aa-4892-8f6e-45da64d7c777.png",
      alt: "Cortile interno Milano - palazzo residenziale tranquillo zona Centrale"
    },
    {
      src: "/lovable-uploads/e92db323-2e5e-4d2c-9042-79fffd113367.png",
      alt: "Mappa posizione Milano - 160m dalla Stazione Centrale, collegamento perfetto"
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

        {/* Griglia di miniature - escludo la prima immagine che è già la copertina */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {images.slice(1, 11).map((image, index) => (
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
