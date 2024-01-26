import { verifyAccessToken } from '@/app/lib/auth/saveToken';
import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const body = await request.json();

  const { userId, token } = body;

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ status: 400, message: '必要な情報が不足しています。' }),
    );
  }

  // アクセストークンの検証
  const authenticated = await verifyAccessToken(userId, token);

  if (authenticated) {
    return new Response(JSON.stringify({ status: 200, authenticated: true }));
  } else {
    return new Response(JSON.stringify({ status: 401, authenticated: false }));
  }
};
