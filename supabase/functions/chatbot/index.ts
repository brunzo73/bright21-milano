import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ACCOMMODATION_INFO = `
INFORMAZIONI ALLOGGIO MILANO - STAZIONE CENTRALE

DESCRIZIONE GENERALE:
- Luminoso monolocale di 32 mq al terzo piano (senza ascensore)
- 4 finestre con doppia esposizione per luce naturale tutto il giorno
- Recentemente ristrutturato con stile moderno e funzionale
- Posizione strategica: accanto alla Stazione Centrale di Milano

CARATTERISTICHE APPARTAMENTO:
- Cucina spaziosa completa di tutto l'indispensabile
- Tavolo da pranzo utilizzabile anche come postazione di lavoro
- Letto ampio e comodo
- TV Smart con canali nazionali, Netflix, Prime Video, YouTube
- Amazon Alexa per musica e informazioni
- Cabina armadio separata
- Bagno ampio e luminoso con spaziosa doccia moderna e lavatrice
- WiFi fibra ottica illimitato
- Impianto illuminazione cromatica per atmosfera
- Climatizzazione (riscaldamento/aria condizionata)

POSIZIONE E TRASPORTI:
- A soli 2 minuti a piedi dalla Stazione Centrale di Milano
- 3° piano senza ascensore (salita leggera e facilmente affrontabile)
- Palazzo con cortile interno tranquillo
- Posizione centralissima ma silenziosa grazie a finestre con doppi vetri
- Metropolitana: linee M2 e M3 per raggiungere Duomo, via Montenapoleone, Castello Sforzesco in meno di 10 minuti
- Accesso diretto a metro e bus per gli aeroporti

SERVIZI ZONA:
- Ricca di servizi: supermercati, negozi, banche, bar, pasticcerie, pizzerie, ristoranti
- Ideale per shopping e vita notturna
- Tutti i servizi necessari a portata di mano

COMFORT:
- Perfetto per esplorare Milano o soggiorni business
- Equilibrio perfetto tra tranquillità e comodità nel cuore di Milano
- Massima luminosità e comfort grazie alle 4 finestre con doppia esposizione
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
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `Sei Milo, un assistente virtuale specializzato nell'alloggio di Milano vicino alla Stazione Centrale. 

ISTRUZIONI COMPORTAMENTALI:
- Rispondi sempre in italiano
- Sii cordiale, professionale e utile
- Mantieni un tono amichevole ma informativo
- Se non sai qualcosa sui dettagli specifici dell'alloggio, suggerisci di contattare i proprietari
- Fornisci informazioni pratiche e utili per i viaggiatori
- Sii conciso ma completo nelle risposte

INFORMAZIONI ALLOGGIO:
${ACCOMMODATION_INFO}

REGOLE:
- Rispondi solo a domande relative all'alloggio, Milano, trasporti, servizi della zona
- Per prenotazioni, rimanda al modulo di contatto presente nel sito
- Non fornire informazioni non correlate all'alloggio o al turismo a Milano
- Se richiesto di prenotare, spiega che possono usare il modulo di prenotazione presente nella pagina`
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