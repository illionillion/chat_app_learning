import { deactivateAccessToken } from '@/lib/auth/saveToken';
import type { NextRequest } from 'next/server';

/**
 * ログアウト
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const { userId } = await request.json();

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
  // トークンの無効化
  const success = await deactivateAccessToken(userId, accessToken);
  if (success) {
    return new Response(
      JSON.stringify({
        message: 'トークンが正常に無効化されました。',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } else {
    return new Response(
      JSON.stringify({
        message: 'トークンの無効化に失敗しました。',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
