import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const getResponse = (msg: string): string => {
  const m = msg.toLowerCase();
  const it = /[àèéìòùáíóú]/.test(m) || /\b(ciao|dove|come|cosa|quando|quanto|hai|ho|mi|il|la|le|per|non|si|può|è|con|che|del|della|in|un|una)\b/.test(m);

  if (/price|cost|rate|quanto|prezzo|costo|€|euro|notte|night/.test(m))
    return it
      ? "Il prezzo parte da €35 a persona a notte per 2 ospiti. Per disponibilità e prezzi esatti compila il form di prenotazione sulla pagina!"
      : "Starting from €35 per person per night for 2 guests. For exact pricing and availability, use the booking form on this page!";

  if (/check.?in|arriv|quando posso entrare/.test(m))
    return it
      ? "Il check-in è dalle 15:00. Offriamo flessibilità sugli orari — basta indicarlo nel form di prenotazione!"
      : "Check-in is from 3:00 PM. We offer flexible check-in — just let us know your arrival time in the booking form!";

  if (/check.?out|depart|partenz|uscire/.test(m))
    return it
      ? "Il check-out è entro le 11:00. L'early check-out è sempre possibile!"
      : "Check-out is by 11:00 AM. Early check-out is always possible!";

  if (/wifi|internet|connessione|fibra/.test(m))
    return it
      ? "L'appartamento ha WiFi in fibra ottica illimitato incluso — perfetto per smartworking o streaming."
      : "The apartment has unlimited fiber optic WiFi included — perfect for remote work or streaming.";

  if (/parking|parcheggio|garage|auto/.test(m))
    return it
      ? "Non c'è parcheggio privato, ma ci sono parcheggi pubblici a pagamento vicino all'edificio e alla Stazione Centrale."
      : "There is no private parking, but there are paid public parking areas near the building and Central Station.";

  if (/malpensa|linate|orio|airport|aeroporto/.test(m))
    return it
      ? "Da Malpensa: Malpensa Express diretto a Milano Centrale in 40 minuti — arrivi davanti all'appartamento! Da Linate: bus o taxi ~30 min. Da Orio al Serio (Bergamo): bus diretto a Milano Centrale ~1 ora."
      : "From Malpensa: Malpensa Express direct to Milano Centrale in 40 min — you arrive right at the apartment! From Linate: bus or taxi ~30 min. From Orio al Serio (Bergamo): direct bus to Milano Centrale ~1 hour.";

  if (/metro|transport|subway|bus|tram|trasport|come si arriva/.test(m))
    return it
      ? "L'appartamento è a 2 minuti a piedi da Milano Centrale, con accesso diretto alle linee Metro M2 e M3. Duomo, Castello Sforzesco e Via Montenapoleone sono raggiungibili in meno di 10 minuti!"
      : "The apartment is 2 minutes walk from Milano Centrale, with direct access to Metro M2 and M3. Duomo, Sforza Castle and Via Montenapoleone are all under 10 minutes away!";

  if (/kitchen|cucina|cook|cucinare|fridge|frigo|oven|forno|microwave/.test(m))
    return it
      ? "La cucina è completamente attrezzata: forno, piano cottura, microonde, frigo, freezer, lavastoviglie, macchina Nespresso e tutto l'occorrente per cucinare."
      : "The kitchen is fully equipped: oven, hob, microwave, fridge, freezer, dishwasher, Nespresso machine and all dishes and utensils.";

  if (/washing|laundry|lavatrice|wash/.test(m))
    return it
      ? "Sì, c'è una lavatrice e uno stendino per i panni."
      : "Yes! There is a washing machine and a clothes drying rack available.";

  if (/netflix|tv|streaming|amazon|prime|youtube/.test(m))
    return it
      ? "L'appartamento ha una Smart TV con Netflix, Prime Video e YouTube inclusi, più Amazon Alexa per musica e informazioni."
      : "The apartment has a Smart TV with Netflix, Prime Video and YouTube included, plus Amazon Alexa for music.";

  if (/air|condit|heating|heat|aria|condizionata|riscaldamento|clima/.test(m))
    return it
      ? "C'è un sistema di aria condizionata split che funziona sia per il riscaldamento che per il raffreddamento — confortevole tutto l'anno."
      : "The apartment has a split-type air conditioning system for both heating and cooling — comfortable all year round.";

  if (/location|address|where|dove|indirizzo|via sammartini/.test(m))
    return it
      ? "Siamo in Via Giovanni Battista Sammartini 21, Milano — a soli 2 minuti a piedi dalla Stazione Centrale. Il palazzo ha un tranquillo cortile interno. Supermercati, ristoranti e bar sono tutti raggiungibili a piedi."
      : "We are at Via Giovanni Battista Sammartini 21, Milan — just 2 minutes walk from Milano Centrale. The building has a quiet inner courtyard. Supermarkets, restaurants and bars are all within walking distance.";

  if (/elevator|lift|ascensore|scale|stairs|floor|piano/.test(m))
    return it
      ? "L'appartamento è al 3° piano senza ascensore — una salita leggera e facilmente gestibile!"
      : "The apartment is on the 3rd floor with no elevator — a light and easily manageable climb!";

  if (/towel|linen|sheet|asciugamani|lenzuola|biancheria/.test(m))
    return it
      ? "Biancheria da letto e asciugamani sono forniti e inclusi."
      : "Bed linen and towels are provided and included.";

  if (/checkin|self.?check|lockbox|chiave|key|access/.test(m))
    return it
      ? "Il check-in è self check-in tramite cassetta delle chiavi — autonomo e flessibile, senza bisogno di aspettare nessuno."
      : "Check-in is self check-in via key lockbox — fully autonomous and flexible, no need to wait for anyone.";

  if (/review|recensione|rating|voto|stelle|star/.test(m))
    return it
      ? "Abbiamo oltre 190 recensioni su Airbnb con una valutazione media di 4.59/5 ⭐ — gli ospiti apprezzano soprattutto la posizione, la comunicazione e il check-in."
      : "We have over 190 reviews on Airbnb with an average rating of 4.59/5 ⭐ — guests love the location, communication and check-in experience.";

  if (/guest|ospiti|persone|people|quanti|capacity|posto letto/.test(m))
    return it
      ? "L'appartamento ospita fino a 2 persone. C'è un letto matrimoniale e un bagno privato."
      : "The apartment accommodates up to 2 guests. There is one double bed and a private bathroom.";

  if (/size|dimension|mq|sqm|square|grande|spazio/.test(m))
    return it
      ? "L'appartamento è un luminoso monolocale di 32 mq al 3° piano con 4 finestre e doppia esposizione — piena luce naturale per tutto il giorno!"
      : "The apartment is a bright 32 sqm studio on the 3rd floor with 4 windows and double exposure — natural light all day!";

  if (/duomo|montenapoleone|castello|sforzesco|navigli|brera|city|città|cosa vedere/.test(m))
    return it
      ? "Da qui raggiungi il Duomo, Via Montenapoleone e il Castello Sforzesco in meno di 10 minuti con la metro. Anche i Navigli e Brera sono facilmente raggiungibili. E dalla Stazione Centrale puoi fare gite a Como, Verona, Firenze, Venezia e molte altre città!"
      : "From here you can reach the Duomo, Via Montenapoleone and Sforza Castle in under 10 minutes by metro. Navigli and Brera are also easily reachable. And from Centrale you can take day trips to Como, Verona, Florence, Venice and more!";

  if (/book|booking|reserve|reservation|prenot|disponib|availab/.test(m))
    return it
      ? "Per verificare la disponibilità e prenotare, compila il form di prenotazione su questa pagina. Confermiamo entro 24 ore! 😊"
      : "To check availability and book, please use the booking form on this page. We confirm within 24 hours! 😊";

  if (/cancell|rimborso|refund|annull|disdetta/.test(m))
    return it
      ? "Politica di cancellazione: per soggiorni brevi è moderata — rimborso completo se cancelli entro 48h dalla prenotazione E almeno 14 giorni prima del check-in. Per soggiorni lunghi è semi-flessibile. Per i dettagli precisi sul tuo soggiorno, compila il form e ti risponderemo! 📋"
      : "Cancellation policy: for short stays it's moderate — full refund if you cancel within 48h of booking AND at least 14 days before check-in. For longer stays, semi-flexible policy applies. Fill the booking form for details specific to your stay! 📋";

  if (/pagam|payment|pay|bonifico|transfer|cash|contanti|metodo|come pago/.test(m))
    return it
      ? "I dettagli e le modalità di pagamento vengono comunicati alla conferma della prenotazione. Il pagamento avviene prima del check-in. Per qualsiasi informazione, compila il form e ti risponderemo entro 24 ore! 💳"
      : "Payment details and methods are shared upon booking confirmation. Payment is required before check-in. Fill the booking form and we'll get back to you within 24 hours! 💳";

  if (/animali|pets|cane|gatto|dog|cat|pet/.test(m))
    return it
      ? "Purtroppo l'appartamento non accetta animali domestici. 🐾 Ci scusiamo per l'inconveniente!"
      : "Unfortunately the apartment does not accept pets. 🐾 We apologize for the inconvenience!";

  if (/fum|smok|sigarett|cigarett/.test(m))
    return it
      ? "L'appartamento è rigorosamente vietato fumare, sia all'interno che nelle aree comuni. 🚭"
      : "The apartment is strictly non-smoking, both inside and in the common areas. 🚭";

  if (/deposit|caparra|cauzione|security deposit/.test(m))
    return it
      ? "Non richiediamo una caparra separata per i soggiorni brevi. Eventuali dettagli aggiuntivi vengono comunicati alla conferma della prenotazione."
      : "We do not require a separate security deposit for short stays. Any additional details are communicated upon booking confirmation.";

  if (/silenz|rumore|noise|quiet|orari|regole|rules/.test(m))
    return it
      ? "Chiediamo di rispettare il silenzio dalle 22:00 alle 8:00 per non disturbare i vicini. L'edificio ha un tranquillo cortile interno — ambiente sereno garantito! 🌙"
      : "We ask guests to observe quiet hours from 10 PM to 8 AM out of respect for neighbors. The building has a quiet inner courtyard — peaceful environment guaranteed! 🌙";

  if (/minimum|minimo|durata|how long|quante notti|notti minimo/.test(m))
    return it
      ? "Il soggiorno minimo è di 1 notte, massimo 28 notti. Accogliamo soggiorni di qualsiasi durata! Per date specifiche usa il form di prenotazione."
      : "Minimum stay is 1 night, maximum 28 nights. We welcome stays of any length! Use the booking form for specific dates.";

  return it
    ? "Ottima domanda! Per informazioni più dettagliate puoi compilare il form di prenotazione e ti risponderemo personalmente. Di solito rispondiamo entro poche ore! 😊"
    : "Great question! For more details, use the booking form and we'll answer everything personally. We usually reply within a few hours! 😊";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const isIt = typeof navigator !== 'undefined' && navigator.language?.startsWith('it');
    return [{
      id: '1',
      text: isIt
        ? "Ciao! Sono Milo 👋 L'assistente virtuale di Bright 21. Come posso aiutarti? Puoi chiedermi di posizione, check-in, servizi, prezzi, cancellazioni o qualsiasi altra cosa sull'appartamento!"
        : "Hello! I'm Milo 👋 The virtual assistant for Bright 21. How can I help you? Ask me about the location, check-in, amenities, pricing, cancellations or anything about the apartment!",
      isBot: true,
      timestamp: new Date()
    }];
  });
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToNewMessage = () => {
    // Se l'ultimo messaggio è del bot e ci sono almeno 2 messaggi
    if (messages.length >= 2 && messages[messages.length - 1].isBot) {
      // Trova l'ultimo messaggio del bot
      const lastBotMessageIndex = messages.length - 1;
      const messagesContainer = messagesEndRef.current?.parentElement;
      
      if (messagesContainer) {
        // Calcola la posizione dell'ultimo messaggio del bot
        const messageElements = messagesContainer.querySelectorAll('[data-message-index]');
        const lastBotMessageElement = messageElements[lastBotMessageIndex] as HTMLElement;
        
        if (lastBotMessageElement) {
          // Scroll all'inizio del messaggio del bot invece che alla fine
          lastBotMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
    }
    
    // Fallback: scroll normale alla fine per messaggi utente o caso di default
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToNewMessage();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };
    const response = getResponse(inputValue);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          aria-label="Open Milo chat"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col bg-background/95 backdrop-blur-sm border-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Milo</h3>
                <p className="text-xs opacity-90">Assistente virtuale</p>
              </div>
            </div>
            <Button
              aria-label="Close Milo chat"
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  data-message-index={index}
                  className={`flex gap-2 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {message.isBot && (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-3 w-3 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-2 rounded-lg text-sm ${
                      message.isBot
                        ? 'bg-muted text-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {message.text}
                  </div>
                  {!message.isBot && (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </div>
              ))}

            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi il tuo messaggio..."
                className="flex-1"
              />
              <Button
                aria-label="Send message"
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default Chatbot;