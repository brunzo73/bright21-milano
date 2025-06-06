
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingEmailRequest {
  name: string;
  email: string;
  phone: string;
  checkin: string;
  checkout: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, checkin, checkout, message }: BookingEmailRequest = await req.json();

    // Format dates for better readability
    const checkinDate = new Date(checkin).toLocaleDateString('it-IT');
    const checkoutDate = new Date(checkout).toLocaleDateString('it-IT');

    const emailResponse = await resend.emails.send({
      from: "Casetta Milano <onboarding@resend.dev>",
      to: ["alebresci75@gmail.com", "lorenzo.vigo@gmail.com"],
      subject: `Nuova richiesta informazioni per casetta Milano da ${checkinDate} a ${checkoutDate}`,
      html: `
        <h2>Nuova richiesta di prenotazione ricevuta</h2>
        
        <h3>Dati del cliente:</h3>
        <ul>
          <li><strong>Nome:</strong> ${name || 'Non specificato'}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Telefono:</strong> ${phone || 'Non specificato'}</li>
        </ul>
        
        <h3>Dettagli soggiorno:</h3>
        <ul>
          <li><strong>Check-in:</strong> ${checkinDate}</li>
          <li><strong>Check-out:</strong> ${checkoutDate}</li>
        </ul>
        
        ${message ? `
        <h3>Messaggio aggiuntivo:</h3>
        <p>${message}</p>
        ` : ''}
        
        <hr>
        <p><small>Richiesta ricevuta il: ${new Date().toLocaleString('it-IT')}</small></p>
        <p><small>Consenso privacy: Accettato</small></p>
      `,
    });

    console.log("Email inviata con successo:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Errore nell'invio email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
