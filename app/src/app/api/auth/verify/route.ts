import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const body = await request.json();

  const { userId } = body;

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ message: '必要な情報が不足しています。' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const accessToken = token.replace('Bearer ', '').trim();

  // アクセストークンの検証
  const authenticated = await verifyAccessToken(userId, accessToken);

  if (authenticated) {
    return new Response(JSON.stringify({ authenticated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
