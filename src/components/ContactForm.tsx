import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Star, Users } from 'lucide-react';
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.success('Request sent successfully! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      checkin: '',
      checkout: '',
      message: ''
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  return <section id="contact" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 gradient-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Book Your <span className="text-amber-600">Stay</span>
          </h2>
          
          {/* Striking Price Banner */}
          <div className="relative mx-auto mb-8 max-w-md">
            <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 p-1 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="bg-white rounded-xl p-6 text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-50/30 to-yellow-50/30 pointer-events-none"></div>
                <div className="absolute -top-2 -right-2 w-12 h-12 bg-amber-400 rounded-full opacity-20"></div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-yellow-400 rounded-full opacity-20"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-amber-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">For 2 guests</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-lg text-gray-600">from</span>
                    <div className="mt-1">
                      <span className="text-4xl font-bold text-gray-800">€69</span>
                      <span className="text-lg text-gray-600">per night</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-2">Premium Location</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg px-3 py-1 inline-block">
                    <span className="text-sm font-semibold text-green-800">✓ Best Rate Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Complete the form below to get instant availability and confirm your booking at this exclusive rate
          </p>
        </div>

        <Card className="shadow-2xl border-amber-200 mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl text-center text-gray-800">
              Check Availability & Secure Your Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium text-sm sm:text-base">
                    Full name *
                  </Label>
                  <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" placeholder="Your full name" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                    Email *
                  </Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" placeholder="your-email@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium text-sm sm:text-base">
                  Phone number (with country code) *
                </Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" placeholder="+39 123 456 7890" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-gray-700 font-medium text-sm sm:text-base">
                    Check-in date *
                  </Label>
                  <Input id="checkin" name="checkin" type="date" value={formData.checkin} onChange={handleChange} required className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-gray-700 font-medium text-sm sm:text-base">
                    Check-out date *
                  </Label>
                  <Input id="checkout" name="checkout" type="date" value={formData.checkout} onChange={handleChange} required className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium text-sm sm:text-base">
                  Additional message
                </Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" placeholder="Tell us more about your stay..." />
              </div>

              <div className="text-center">
                <Button type="submit" className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 w-full sm:w-auto">
                  Check Availability Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>;
};
export default ContactForm;