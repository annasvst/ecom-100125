import Link from 'next/link';
import { Button } from './ui/button';

export function Navbar() {
  return (
    <nav className='flex justify-end gap-6 p-4'>
      <Button asChild>
        <Link href='/admin/products/new'>Add new Product</Link>
      </Button>
      <Button asChild>
        <Link href='/auth/login'>Login</Link>
      </Button>
      <Button asChild>
        <Link href='/auth/login'>Logout</Link>
      </Button>
    </nav>
  );
}
