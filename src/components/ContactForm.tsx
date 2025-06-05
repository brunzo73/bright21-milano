
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Star, Users, Shield } from 'lucide-react';

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
  const [captcha, setCaptcha] = useState({ question: '', answer: 0, userAnswer: '' });

  // Genera una nuova domanda captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let question;
    
    if (operation === '+') {
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
    } else {
      answer = num1 - num2;
      question = `${num1} - ${num2}`;
    }
    
    setCaptcha({ question, answer, userAnswer: '' });
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazioni
    if (!formData.email) {
      toast.error('L\'email è obbligatoria');
      return;
    }

    if (!formData.checkin || !formData.checkout) {
      toast.error('Le date di check-in e check-out sono obbligatorie');
      return;
    }

    if (!privacyConsent) {
      toast.error('È necessario accettare il trattamento dati per procedere');
      return;
    }

    if (parseInt(captcha.userAnswer) !== captcha.answer) {
      toast.error('Risposta captcha errata. Riprova.');
      generateCaptcha();
      return;
    }

    // Prepara i dati per l'invio
    const emailData = {
      to: ['alebresci75@gmail.com', 'lorenzo.vigo@gmail.com'],
      subject: `Nuova richiesta informazioni per casetta Milano da ${formData.checkin} a ${formData.checkout}`,
      body: `
        Nuova richiesta di prenotazione ricevuta:
        
        Nome: ${formData.name || 'Non specificato'}
        Email: ${formData.email}
        Telefono: ${formData.phone || 'Non specificato'}
        Check-in: ${formData.checkin}
        Check-out: ${formData.checkout}
        
        Messaggio:
        ${formData.message || 'Nessun messaggio aggiuntivo'}
        
        Consenso privacy: Accettato
        Data richiesta: ${new Date().toLocaleString('it-IT')}
      `
    };

    console.log('Dati email da inviare:', emailData);
    
    // Simula invio email (in produzione qui andrà la chiamata API reale)
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptcha({
      ...captcha,
      userAnswer: e.target.value
    });
  };

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
                    <span className="text-sm font-medium text-gray-600">Per 2 ospiti</span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-lg text-gray-600">A partire da</span>
                    <div className="mt-1">
                      <span className="text-4xl font-bold text-gray-800">€69</span>
                      <span className="text-lg text-gray-600">per notte</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-2">Posizione Premium</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg px-3 py-1 inline-block">
                    <span className="text-sm font-semibold text-green-800">✓ Miglior Prezzo Garantito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Compila il modulo per verificare la disponibilità e confermare la tua prenotazione a questa tariffa esclusiva
          </p>
        </div>

        <Card className="shadow-2xl border-amber-200 mx-2 sm:mx-0">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-t-lg">
            <CardTitle className="text-xl sm:text-2xl text-center text-gray-800">
              Verifica Disponibilità & Prenota
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium text-sm sm:text-base">
                    Nome completo
                  </Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" 
                    placeholder="Il tuo nome completo" 
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
                    placeholder="tua-email@esempio.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium text-sm sm:text-base">
                  Numero di telefono (con prefisso internazionale)
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
                    Data check-in *
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
                    Data check-out *
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
                  Messaggio aggiuntivo
                </Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows={4} 
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base" 
                  placeholder="Raccontaci di più sul tuo soggiorno..." 
                />
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label htmlFor="captcha" className="text-gray-700 font-medium text-sm sm:text-base flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Verifica di sicurezza: Quanto fa {captcha.question}? *
                </Label>
                <Input 
                  id="captcha" 
                  type="number" 
                  value={captcha.userAnswer} 
                  onChange={handleCaptchaChange} 
                  required 
                  className="border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-sm sm:text-base max-w-32" 
                  placeholder="Risultato" 
                />
              </div>

              {/* Privacy Checkbox */}
              <div className="flex items-start space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox
                  id="privacy"
                  checked={privacyConsent}
                  onCheckedChange={setPrivacyConsent}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label htmlFor="privacy" className="text-sm font-medium text-gray-900 cursor-pointer">
                    Consenso al trattamento dei dati personali *
                  </Label>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Acconsento al trattamento dei miei dati personali per finalità di gestione della prenotazione e comunicazioni relative al soggiorno, 
                    ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003. I dati saranno trattati esclusivamente per le finalità indicate 
                    e non saranno comunicati a terzi senza consenso.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  type="submit" 
                  className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-3 w-full sm:w-auto"
                  disabled={!privacyConsent}
                >
                  Verifica Disponibilità
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
