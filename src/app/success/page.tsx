import { redirect } from 'next/navigation'

import { stripe } from '../../lib/stripe'
import Link from 'next/link';

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });

  const lineItems = await stripe.checkout.sessions.listLineItems(session_id);
  console.log(lineItems);

  if (status === 'open') {
    return redirect('/');
  }

  if (status === 'complete') {
    return (
      <section id="success" className='text-center max-w-4xl mx-auto'>
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
          {customerEmail}. If you have any questions, please email{' '}
        </p>
        {lineItems?.data?.map(lineItem => (
          <div key={lineItem.id} className='bg-gray-100 p-10 rounded'>
            {lineItem.description} - {lineItem.quantity}
          </div>
        ))}
        <Link href="mailto:orders@example.com">orders@example.com</Link>.
      </section>
    )
  }
}