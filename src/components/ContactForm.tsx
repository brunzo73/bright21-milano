
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Star, Users, Shield, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    checkin: '',
    checkout: '',
    message: ''
  });

  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({ 
    question: '', 
    answer: '', 
    userAnswer: '', 
    options: [] as string[] 
  });

  // Generate a new captcha question
  const generateCaptcha = () => {
    const questions = [
      { question: 'What color is the sky?', answer: 'blue', options: ['red', 'blue', 'green', 'yellow'] },
      { question: 'How many legs does a cat have?', answer: '4', options: ['2', '4', '6', '8'] },
      { question: 'What is 2 + 2?', answer: '4', options: ['3', '4', '5', '6'] },
      { question: 'Which animal says "meow"?', answer: 'cat', options: ['dog', 'cat', 'bird', 'fish'] },
      { question: 'What comes after Monday?', answer: 'tuesday', options: ['sunday', 'tuesday', 'friday', 'saturday'] },
      { question: 'How many days in a week?', answer: '7', options: ['5', '6', '7', '8'] }
    ];
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const shuffledOptions = [...randomQuestion.options].sort(() => Math.random() - 0.5);
    
    setCaptcha({
      question: randomQuestion.question,
      answer: randomQuestion.answer.toLowerCase(),
      userAnswer: '',
      options: shuffledOptions
    });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validations
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
        toast.error('La data di check-in deve essere precedente alla data di check-out');
        return;
      }

      // Validate that check-in is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      checkinDate.setHours(0, 0, 0, 0);
      
      if (checkinDate < today) {
        toast.error('La data di check-in non può essere nel passato');
        return;
      }

      if (!privacyConsent) {
        toast.error('You must accept the privacy policy to proceed');
        return;
      }

      if (captcha.userAnswer.toLowerCase() !== captcha.answer) {
        toast.error('Incorrect captcha answer. Please try again.');
        generateCaptcha();
        return;
      }

      // Save booking data to Supabase
      console.log('Saving booking data to Supabase...');
      console.log('Form data to insert:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        checkin: formData.checkin,
        checkout: formData.checkout,
        message: formData.message
      });

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            checkin: formData.checkin,
            checkout: formData.checkout,
            message: formData.message || null
          }
        ])
        .select();

      if (bookingError) {
        console.error('Errore nel salvare i dati:', bookingError);
        console.error('Dettaglio errore:', JSON.stringify(bookingError, null, 2));
        toast.error(`Errore nel salvare i dati: ${bookingError.message}`);
        return;
      }

      console.log('Booking saved successfully:', bookingData);

      // Create form data for FormSubmit
      const form = document.createElement('form');
      form.action = 'https://formsubmit.co/alebresci75@gmail.com';
      form.method = 'POST';
      form.style.display = 'none';

      // Add form fields
      const fields = [
        { name: '_subject', value: `Nuova richiesta prenotazione Casetta Milano` },
        { name: '_cc', value: 'lorenzo.vigo@gmail.com' },
        { name: '_template', value: 'table' },
        { name: '_captcha', value: 'false' },
        { name: 'name', value: formData.name },
        { name: 'email', value: formData.email },
        { name: 'phone', value: formData.phone },
        { name: 'checkin', value: formData.checkin },
        { name: 'checkout', value: formData.checkout },
        { name: 'message', value: formData.message }
      ];

      fields.forEach(field => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = field.value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      toast.success('Richiesta inviata con successo! Ti contatteremo presto.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        checkin: '',
        checkout: '',
        message: ''
      });
      setPrivacyConsent(false);
      generateCaptcha();

    } catch (error) {
      console.error('Errore nell\'invio:', error);
      toast.error('Errore nell\'invio della richiesta. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaChange = (value: string) => {
    setCaptcha({
      ...captcha,
      userAnswer: value
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

              {/* Captcha */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 font-medium text-sm sm:text-base flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Verification: {captcha.question} *
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={generateCaptcha}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    New Question
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {captcha.options.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleCaptchaChange(option)}
                      className={`p-3 border-2 rounded-lg text-center transition-all ${
                        captcha.userAnswer === option
                          ? 'border-amber-400 bg-amber-50 text-amber-800'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="text-center">
                <Button 
                  type="submit" 
                  className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 w-full sm:w-auto"
                  disabled={!privacyConsent || isSubmitting}
                >
                  {isSubmitting ? 'Invio in corso...' : 'Check Availability'}
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
