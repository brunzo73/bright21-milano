
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

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

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 gradient-bg">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 sm:mb-6 px-2">
            Book Your <span className="text-amber-600">Stay</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Fill out the form to check availability and receive all the information
          </p>
        </div>

        <Card className="shadow-2xl border-amber-200 mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl text-center text-gray-800">
              Check Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium text-sm sm:text-base">
                    Full name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base"
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base"
                    placeholder="your-email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium text-sm sm:text-base">
                  Phone number (with country code) *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base"
                  placeholder="+39 123 456 7890"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-gray-700 font-medium text-sm sm:text-base">
                    Check-in date *
                  </Label>
                  <Input
                    id="checkin"
                    name="checkin"
                    type="date"
                    value={formData.checkin}
                    onChange={handleChange}
                    required
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-gray-700 font-medium text-sm sm:text-base">
                    Check-out date *
                  </Label>
                  <Input
                    id="checkout"
                    name="checkout"
                    type="date"
                    value={formData.checkout}
                    onChange={handleChange}
                    required
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium text-sm sm:text-base">
                  Additional message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base"
                  placeholder="Tell us more about your stay..."
                />
              </div>

              <div className="text-center">
                <Button 
                  type="submit" 
                  className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 w-full sm:w-auto"
                >
                  Check Availability Now
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ContactForm;
