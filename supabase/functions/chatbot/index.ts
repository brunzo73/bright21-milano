import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ACCOMMODATION_INFO = `
ACCOMMODATION INFORMATION - MILAN CENTRAL STATION

ADDRESS: Via Sammartini 21, Milan - Next to Central Station

GENERAL DESCRIPTION:
- Bright 32 sqm studio apartment on the third floor (no elevator)
- 4 windows with double exposure providing natural light all day
- Recently renovated with modern and functional style
- Strategic location: next to Milan Central Station

APARTMENT FEATURES:
- Spacious kitchen complete with all essentials
- Dining table that can also be used as a work station
- Large and comfortable bed
- Smart TV with national channels, Netflix, Prime Video, YouTube
- Amazon Alexa for music and information
- Separate walk-in closet
- Large and bright bathroom with spacious modern shower and washing machine
- Unlimited fiber optic WiFi
- Color lighting system for atmosphere
- Air conditioning (heating/air conditioning)

LOCATION AND TRANSPORT:
- Only 2 minutes walk from Milan Central Station
- 3rd floor without elevator (light climb, easily manageable)
- Building with quiet internal courtyard
- Very central position but quiet thanks to double-glazed windows
- Metro: M2 and M3 lines to reach Duomo, via Montenapoleone, Sforza Castle in less than 10 minutes
- Direct access to metro and buses to airports

✈️ AIRPORT CONNECTIONS - How to reach the apartment from all Milan airports:
Milan is served by three main airports:
• Malpensa (MXP) – The largest and most international
• Linate (LIN) – The closest to the city center  
• Orio al Serio (BGY) – Ideal for low-cost flights

FROM MALPENSA AIRPORT (MXP):
- Malpensa Express train: Direct connection from Terminals 1 and 2 to Milano Centrale in about 40 minutes (leaves you steps away from the apartment!)
- Bus to Central Station: Various companies operate the service, journey takes about 45 minutes with frequent departures
- Taxi or car rental: About 40 minutes travel time

FROM LINATE AIRPORT (LIN):  
- Bus line 73 (via Duomo) or direct shuttles: Connects Linate to city center in about 30 minutes, arriving near Central Station
- Taxi or car rental: Similar duration, subject to traffic

FROM ORIO AL SERIO AIRPORT (BGY):
- Direct bus to Milano Centrale: Service operated by various companies, travel time about 1 hour
- Taxi or car rental: Same estimated time, may vary based on traffic

TRAVEL TIPS:
- Buy tickets in advance for trains and buses (especially Malpensa Express)
- Check updated schedules based on your flight, especially late evening or early morning
- Use local transport apps like Moovit or Citymapper for real-time information and best routes

AREA SERVICES:
- Rich in services: supermarkets, shops, banks, bars, pastry shops, pizzerias, restaurants
- Ideal for shopping and nightlife
- All necessary services within walking distance

COMFORT:
- Perfect for exploring Milan or business stays
- Perfect balance between tranquility and convenience in the heart of Milan
- Maximum brightness and comfort thanks to 4 windows with double exposure
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('Messaggio richiesto');
    }

    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY non configurata');
    }

    console.log('Messaggio ricevuto:', message);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.app',
        'X-Title': 'Milano Accommodation Chatbot'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [
          {
            role: 'system',
            content: `You are Milo, a virtual assistant specialized in the Milan accommodation near Central Station. 

BEHAVIORAL INSTRUCTIONS:
- Always respond in English by default
- Detect the language the user writes in and adapt your responses to match their language
- If user writes in Italian, respond in Italian. If user writes in English, respond in English
- Be friendly, professional and helpful
- Maintain a warm but informative tone
- If you don't know something about specific accommodation details, suggest contacting the owners
- Provide practical and useful information for travelers
- Be concise but complete in your responses

ACCOMMODATION INFORMATION:
${ACCOMMODATION_INFO}

RULES:
- Only respond to questions related to the accommodation, Milan, transport, area services
- For bookings and reservations, direct users to use the booking form available on the landing page
- Do not provide information unrelated to the accommodation or tourism in Milan
- If asked to book or make reservations, explain that they should use the dedicated booking form on the website
- For booking inquiries say: "For bookings and availability, please use the booking form on our website. It's quick and easy to fill out!"

IMPORTANT BOOKING POLICY:
- Never attempt to make bookings yourself
- Always redirect booking requests to the website form
- Emphasize that the booking form is the official way to check availability and make reservations`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Errore OpenRouter:', errorText);
      throw new Error(`Errore API OpenRouter: ${response.status}`);
    }

    const data = await response.json();
    console.log('Risposta OpenRouter ricevuta');

    const botResponse = data.choices[0]?.message?.content || 'Mi dispiace, non riesco a rispondere al momento. Prova a riformulare la domanda.';

    return new Response(JSON.stringify({ response: botResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Errore nel chatbot:', error);
    return new Response(JSON.stringify({ 
      error: 'Si è verificato un errore. Riprova più tardi.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});