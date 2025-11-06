import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  // You could check that the user is authenticated before moving on in this route

  const formData = await request.formData();
  // TODO: zod validation

  console.log('formData', formData);
  const prices = formData.get('prices')?.split(',');
  console.log('prices', prices);

  const lineItems = prices.map((p: string) => ({
    price: p,
    quantity: 1,
  }));

  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    if (session.url) {
      return NextResponse.redirect(session.url, 303);
    } else {
      return NextResponse.json(
        { error: 'Session URL is null' },
        { status: 500 },
      );
    }
  } catch (err) {
    let message = 'An unknown error occurred';
    let statusCode = 500;
    if (err && typeof err === 'object' && 'message' in err) {
      message = (err as { message: string }).message;
    }
    if (err && typeof err === 'object' && 'statusCode' in err) {
      statusCode = (err as { statusCode: number }).statusCode || 500;
    }
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
