'use client';

import { useActionState, useState } from 'react';
import { createProduct } from '@/app/actions/admin/products/new';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { useRef } from 'react';

interface Product {
  name: string;
  description: string;
  tags: string[];
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
  const productNameRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState<string>('');

  if (state.success) {
    return (
      <div className='my-20 max-w-lg mx-auto flex flex-col gap-4'>
        <h1>Product created successfully!</h1>
        {state.data?.imageUrl && (
          <Image
            src={state.data?.imageUrl}
            alt='abstract'
            width={300}
            height={300}
          />
        )}
        {state.data?.downloadUrl && (
          <Button variant='link' asChild>
            <Link href={state.data?.downloadUrl}>Download image</Link>
          </Button>
        )}
      </div>
    );
  }

  async function handleGenerateClick() {
    const productName = productNameRef.current?.value;

    if (!productName) return;
    try {
      const res = await fetch('/api/ai/admin/products', {
        method: 'POST',
        body: JSON.stringify({ productName }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Failed to generate description');
      }
      const data = await res.json();
      setDescription(data.description);
    } catch {
      console.error('Error generating description');
    }
  }

  return (
    <form
      action={action}
      className='my-20 max-w-lg mx-auto flex flex-col gap-4'
    >
      <Label htmlFor='name'>Name</Label>
      <Input
        type='text'
        id='name'
        name='name'
        placeholder='Product Name'
        required
        ref={productNameRef}
      />
      <div className='flex justify-between'>
        <Label htmlFor='description'>Description</Label>
        <Button type='button' size={'sm'} onClick={handleGenerateClick}>
          Generate
        </Button>
      </div>

      <Textarea
        id='description'
        name='description'
        placeholder='Product description'
        value={description}
        required
        readOnly
      />
      {state.errors?.description && (
        <div className='text-sm text-red-600'>
          {state.errors.description.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <Label htmlFor='tags'>Tags (comma-separated)</Label>
      <Input
        type='text'
        id='tags'
        name='tags'
        placeholder='electronics, phone, mobile phone'
      />
      <Label htmlFor='image'>Image</Label>
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
