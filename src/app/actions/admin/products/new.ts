'use server';

import { NewProductFormState } from '@/app/admin/products/new/page';
import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function createProduct(
  currentState: NewProductFormState,
  formData: FormData,
): Promise<NewProductFormState> {

  // Validate form data so everything is correct (zod)

  const imageFile = formData.get('image') as File;
  const imagePath = '/products/images/' + imageFile.name;
  const blob = await put(imagePath, imageFile, {
    access: 'public',
    addRandomSuffix: true,
  });
  console.log(blob);
  revalidatePath('/');

  // If blob.url => save new product to Firebase including image url


  // Call Stripe Product API to create a new product and price(s)
  // Add Product_id and price_id to the product together with img URLs
  // Store product info in DB


  return { 
      success: true,
      data: {
        imageUrl: blob.url,
        downloadUrl: blob.downloadUrl
      }
  };
}
