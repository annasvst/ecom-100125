import { Button } from '@/components/ui/button';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const prices = [
    'price_1SQYXtQitHtctVUTLdrIdHPC',
    'price_1SQXvBQitHtctVUTdKQZ8yaI',
  ];

  return (
    <div className='text-center'>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user.name}!</p>

      <form action='/api/stripe/checkout' method='POST'>
        <section>
          <input type='hidden' name="prices" value={prices.join(',')} />
          <Button type='submit' role='link'>
            Checkout
          </Button>
        </section>
      </form>
    </div>
  );
}
