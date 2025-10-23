'use client';

import { useActionState } from 'react';
import { createProduct } from '@/app/actions/admin/products/new';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

// Use real product type instead!
interface Product {
  imageUrl: string;
  downloadUrl: string;
}

export interface NewProductFormState {
  success: boolean;
  message?: string;
  errors?: {
    [K in keyof Product]?: string[];
  };
  data?: Partial<Product>;
}

export default function AddProductPage() {
  const [state, action, isPending] = useActionState<
    NewProductFormState,
    FormData
  >(createProduct, { success: false });

  if (state.success) {
    return (
      <div className='my-20 max-w-lg mx-auto flex flex-col gap-4'>
        <h1>Image uploaded successfully!</h1>
        {state.data?.imageUrl && (
          <Image
            src={state.data?.imageUrl}
            alt='abstract'
            width={300}
            height={300}
          />
        )}
        {state.data?.downloadUrl && (
          <Button variant="link" asChild>
          <Link href={state.data?.downloadUrl}>Download image</Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <form
      action={action}
      className='my-20 max-w-lg mx-auto flex flex-col gap-4'
    >
      <Label htmlFor='image' className='text-'>
        Image
      </Label>
      <Input
        type='file'
        id='image'
        name='image'
        accept='image/jpeg, image/png, image/webp, image/avif'
        required
      />
      <Button className='mt-6'>Upload</Button>
    </form>
  );
}
