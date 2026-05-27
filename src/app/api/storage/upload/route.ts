import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'Legacy upload endpoint removed. Use /api/storage/presign instead.',
    },
    { status: 410 }
  );
}

