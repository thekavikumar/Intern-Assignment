import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward the request to the backend at localhost:5000
    const backendResponse = await fetch(
      'http://localhost:5000/api/rules/combine_rules',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body), // Send the same body received from the frontend
      }
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to create rule in the backend' },
        { status: 500 }
      );
    }

    const responseData = await backendResponse.json();

    // Return backend response to frontend
    return NextResponse.json(responseData, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
