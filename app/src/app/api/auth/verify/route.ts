import { verifyAccessToken } from '@/lib/auth/saveToken';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const { userId, token } = body;

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ status: 400, message: '必要な情報が不足しています。' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // アクセストークンの検証
  const authenticated = await verifyAccessToken(userId, token);

  if (authenticated) {
    return new Response(JSON.stringify({ status: 200, authenticated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ status: 401, authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
