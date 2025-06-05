
import React, { useState, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const images = [
    // Main image (cover) - already used in hero
    {
      src: "/lovable-uploads/7353437d-1677-46df-af2a-f9e3936200c6.png",
      alt: "Bright Milan Central Station studio apartment - modern apartment overview"
    },
    // Bedroom
    {
      src: "/lovable-uploads/789a1024-dc38-4fff-8ea2-ae0956adffed.png",
      alt: "Comfortable Milan bedroom - double bed with Milan artwork"
    },
    {
      src: "/lovable-uploads/9fdb0a74-dcc3-4ce2-94e4-6f4cb0ba1979.png",
      alt: "Milan bedroom details - fresh towels and comfort"
    },
    // Kitchen
    {
      src: "/lovable-uploads/61af2c61-70e4-4627-9ac5-581f5e340d7f.png",
      alt: "Modern Milan Central kitchen - equipped with window and yellow curtains"
    },
    {
      src: "/lovable-uploads/85376af8-9d1c-49c4-a5c1-1d5fc7801edb.png",
      alt: "Milan dining area - table for two with equipped kitchen view"
    },
    {
      src: "/lovable-uploads/4519b0f4-7471-48e9-8987-b7bb29791f0d.png",
      alt: "Bright Milan dining area - modern table near Central Station"
    },
    // Bathroom
    {
      src: "/lovable-uploads/e7bda387-e83b-4db6-ae31-2e1e6a7a5561.png",
      alt: "Modern Milan bathroom - spacious shower with glass enclosure and heated towel rail"
    },
    // Exterior and location
    {
      src: "/lovable-uploads/55e2504b-5cbf-4165-9e6d-0069d84f92bf.png",
      alt: "Via Sammartini Milan - strategic location near Central Station"
    },
    {
      src: "/lovable-uploads/ebcc6466-ce6c-494d-9bdc-27d0acd17f60.png",
      alt: "Elegant Milan building entrance - bright hallway with classic architecture Via Sammartini"
    },
    {
      src: "/lovable-uploads/2866d0c7-58aa-4892-8f6e-45da64d7c777.png",
      alt: "Milan inner courtyard - quiet residential building Central area"
    },
    {
      src: "/lovable-uploads/e92db323-2e5e-4d2c-9042-79fffd113367.png",
      alt: "Milan location map - 160m from Central Station, perfect connection"
    }
  ];

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollToImage = useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  }, [api]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Your <span className="text-amber-600">Milan</span> Retreat
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Discover the bright and modern spaces that will welcome you during your stay
          </p>
        </div>
        
        {/* Main gallery with carousel */}
        <div className="mb-8 sm:mb-12">
          <Carousel setApi={setApi} className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="rounded-xl overflow-hidden shadow-lg mx-2 sm:mx-0 cursor-pointer hover:shadow-xl transition-shadow">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl w-full p-0 bg-black border-0">
                      <div className="relative">
                        <img 
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-auto max-h-[90vh] object-contain"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>

        {/* Thumbnail grid - all images clickable to jump to main carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`card-hover rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 ${
                current === index ? 'ring-2 ring-amber-500 ring-offset-2' : ''
              }`}
              onClick={() => scrollToImage(index)}
            >
              <img 
                src={image.src}
                alt={image.alt}
                className="w-full h-20 sm:h-24 md:h-32 object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 sm:p-8 md:p-12 mx-2 sm:mx-0">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
              Four windows for maximum brightness
            </h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Enjoy natural light filtering throughout the day through large windows, 
              creating a warm and welcoming atmosphere. The modern design blends perfectly 
              with comfort, offering you an ideal space to relax after exploring Milan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
