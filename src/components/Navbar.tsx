import Link from 'next/link';
import { Button } from './ui/button';
import { auth0 } from '@/lib/auth0';

export async function Navbar() {
  const session = await auth0.getSession();

  return (
    <nav className='flex justify-end gap-6 p-4 max-w-7xl mx-auto'>
      {session ? (
        <>
          <Button asChild>
            <Link href='/admin/products/new'>Add new Product</Link>
          </Button>

          <Button asChild>
            <Link href='/auth/login'>Logout</Link>
          </Button>
        </>
      ) : (
        <Button asChild>
          <Link href='/auth/login'>Login</Link>
        </Button>
      )}
    </nav>
  );
}
