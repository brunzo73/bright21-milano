
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Star, Users } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    checkin: '',
    checkout: '',
    message: ''
  });

  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [occupiedRanges, setOccupiedRanges] = useState<{ start: string; end: string }[]>([]);
  const [calendarSynced, setCalendarSynced] = useState(false);

  const AIRBNB_ICAL = 'https://www.airbnb.it/calendar/ical/838297807993191673.ics?t=92a68c435ac2474d80e344233c04b281';

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(AIRBNB_ICAL)}`;
        const res = await fetch(proxy, { signal: AbortSignal.timeout(10000) });
        if (!res.ok) return;
        const text = await res.text();
        const blocks = text.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
        const events: { start: string; end: string }[] = [];
        for (const block of blocks) {
          const s = block.match(/DTSTART[^:]*:(\d{8})/);
          const e = block.match(/DTEND[^:]*:(\d{8})/);
          if (s && e) {
            const fmt = (d: string) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
            events.push({ start: fmt(s[1]), end: fmt(e[1]) });
          }
        }
        setOccupiedRanges(events);
        if (events.length > 0) setCalendarSynced(true);
      } catch {
        // Silent fail — form still works without live calendar data
      }
    };
    fetchCalendar();
  }, []);

  const datesOverlapOccupied = (cin: string, cout: string): boolean => {
    const a = new Date(cin);
    const b = new Date(cout);
    return occupiedRanges.some(r => a < new Date(r.end) && b > new Date(r.start));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (honeypot) { setIsSubmitting(false); return; }
    
    try {
      // Validations
      if (!formData.name.trim()) {
        toast.error('Full name is required');
        return;
      }

      if (!formData.email) {
        toast.error('Email is required');
        return;
      }

      if (!formData.checkin || !formData.checkout) {
        toast.error('Check-in and check-out dates are required');
        return;
      }

      // Validate that check-in is before check-out
      const checkinDate = new Date(formData.checkin);
      const checkoutDate = new Date(formData.checkout);
      
      if (checkinDate >= checkoutDate) {
        toast.error('Check-in must be before check-out');
        return;
      }

      // Check against live Airbnb calendar
      if (occupiedRanges.length > 0 && datesOverlapOccupied(formData.checkin, formData.checkout)) {
        toast.error('These dates are already booked. Please choose different dates or contact us.');
        return;
      }

      // Validate that check-in is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkinDate.setHours(0, 0, 0, 0);
      
      if (checkinDate < today) {
        toast.error('Check-in cannot be in the past');
        return;
      }

      if (!privacyConsent) {
        toast.error('You must accept the privacy policy to proceed');
        return;
      }

      // Submit via Netlify Forms
      const encode = (data: Record<string, string>) =>
        Object.keys(data)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
          .join('&');

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'booking',
          'bot-field': honeypot,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          guests: formData.guests,
          checkin: formData.checkin,
          checkout: formData.checkout,
          message: formData.message
        }),
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      toast.success('Booking request sent! Check your email — we will confirm within 24 hours.');
      setFormStatus('success');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests: '2',
        checkin: '',
        checkout: '',
        message: ''
      });
      setPrivacyConsent(false);

    } catch (error) {
      console.error('Booking request failed');
      toast.error('Unable to send your request. Please try again later.');
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Set minimum date to today for check-in
  const today = new Date().toISOString().split('T')[0];
  // Set minimum date for check-out based on check-in date
  const minCheckoutDate = formData.checkin || today;

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 gradient-bg">
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
                    <span className="text-sm text-gray-500">Starting from</span>
                    <div className="mt-1">
                      <span className="text-4xl font-bold text-amber-600">€35</span>
                      <span className="text-lg text-gray-600 block">per night per person</span>
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
                    <span className="text-sm font-semibold text-green-800">✓ Best Price Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Fill out the form to check availability and confirm your booking at this exclusive rate
          </p>
        </div>

        <Card className="shadow-2xl border-amber-200 mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl text-center text-gray-800">
              Check Availability & Book
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium text-sm sm:text-base">
                    Full Name
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
                  Phone Number (with international prefix)
                </Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" 
                  placeholder="+39 123 456 7890" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests" className="font-medium text-sm sm:text-base">
                  Number of Guests
                </Label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                </select>
              </div>

              {calendarSynced && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span>✓</span> Calendar synced with Airbnb — unavailable dates are automatically blocked
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="checkin" className="text-gray-700 font-medium text-sm sm:text-base">
                    Check-in Date *
                  </Label>
                  <Input 
                    id="checkin" 
                    name="checkin" 
                    type="date" 
                    value={formData.checkin} 
                    onChange={handleChange} 
                    required 
                    min={today}
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="checkout" className="text-gray-700 font-medium text-sm sm:text-base">
                    Check-out Date *
                  </Label>
                  <Input 
                    id="checkout" 
                    name="checkout" 
                    type="date" 
                    value={formData.checkout} 
                    onChange={handleChange} 
                    required 
                    min={minCheckoutDate}
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium text-sm sm:text-base">
                  Additional Message
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

              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />

              {/* Privacy Checkbox */}
              <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox
                  id="privacy"
                  checked={privacyConsent}
                  onCheckedChange={(checked) => setPrivacyConsent(checked === true)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="privacy" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Consent to personal data processing *
                  </Label>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    I consent to the processing of my personal data for booking management and stay-related communications, 
                    in accordance with EU Regulation 2016/679 (GDPR) and Legislative Decree 196/2003. Data will be processed 
                    exclusively for the indicated purposes and will not be communicated to third parties without consent.
                  </p>
                </div>
              </div>

              {formStatus === 'success' && (
                <div className="rounded-xl bg-green-50 border-2 border-green-400 p-4 text-center">
                  <p className="text-green-800 font-semibold text-base">✅ Request sent successfully!</p>
                  <p className="text-green-700 text-sm mt-1">We'll confirm availability within 24 hours. Check your email.</p>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="rounded-xl bg-red-50 border-2 border-red-400 p-4 text-center">
                  <p className="text-red-800 font-semibold text-base">❌ Could not send your request</p>
                  <p className="text-red-700 text-sm mt-1">Please try again or contact us directly at <a href="mailto:alebresci75@gmail.com" className="underline font-medium">alebresci75@gmail.com</a></p>
                </div>
              )}

              <div className="text-center">
                <Button
                  type="submit"
                  className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 w-full sm:w-auto"
                  disabled={!privacyConsent || isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Check Availability'}
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