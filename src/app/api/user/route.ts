import { NextResponse } from 'next/server';

export async function GET(req: Request): Promise<NextResponse> {
    console.log('Incoming GET request', req);

  // in Real life, you have a logic here to handle request (e.g. create user, update user or similar)
  return NextResponse.json({user: {name: 'John', email: 'john@gmail.com'}}, { status: 200 });

}

export async function POST(req: Request): Promise<NextResponse> {
  console.log('Incoming POST request', req);

  // in Real life, you have a logic here to handle request (e.g. create user, update user or similar)
  return NextResponse.json({user: {name: 'John', email: 'john@gmail.com'}}, { status: 200 });

}

export async function DELETE(req: Request): Promise<NextResponse> {
  console.log('Incoming DELETE request', req);

  // in Real life, you have a logic here to handle request (e.g. create user, update user or similar)
  return NextResponse.json({ status: 200 });
}

