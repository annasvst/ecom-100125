import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { perplexity } from '@/lib/ai/perplexity';

const productNameSchema = z.object({
  productName: z.string().min(3).max(150),
});

export async function POST(request: NextRequest) {
  const session = await auth0.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // TODO: check in firebase if the user is admin or not. If not, return return NextResponse.json({ error: "Unathorised" }, { status: 403 });

  const body = await request.json();

  console.log('body', body)

  const result = productNameSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid product name', details: result.error.issues },
      { status: 400 },
    );
  }
  console.log('result', result);

  if (!result.data?.productName) return NextResponse.json(
      { error: 'Missing product name' },
      { status: 400 },
    );

  const prompt = `Find details about the product "${result.data?.productName}" and write a 
             compelling, SEO-friendly e-commerce product description (max 500 chars).
             Focus on key features and benefits found in your search.`;

  const { object } = await generateObject({
    model: perplexity('sonar'),
    schema: z.object({
      description: z.string().max(1000)
    }),
    prompt: prompt
  });

  console.log('object', object);

  return NextResponse.json(object, { status: 200 });
}
