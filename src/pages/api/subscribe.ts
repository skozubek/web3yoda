// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';

export const prerender = false;

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return email.length <= 320 && emailRegex.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    // Validate environment variables
    const BEEHIIV_API_KEY = import.meta.env.BEEHIIV_API_KEY;
    const BEEHIIV_PUBLICATION_ID = import.meta.env.BEEHIIV_PUBLICATION_ID;

    if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error'
        }),
        { status: 500, headers }
      );
    }

    // Parse and validate request
    const body = await request.json();
    const email = body.email?.toString().toLowerCase().trim();

    if (!email || !isValidEmail(email)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please provide a valid email address'
        }),
        { status: 400, headers }
      );
    }

    // Call Beehiiv API
    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: 'website',
          double_opt_in: false
        })
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to subscribe',
          details: responseData
        }),
        { status: response.status, headers }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed!'
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred'
      }),
      { status: 500, headers }
    );
  }
};