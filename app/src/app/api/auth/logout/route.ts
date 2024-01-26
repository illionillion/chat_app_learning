import { deactivateAccessToken } from '@/app/lib/auth/saveToken';
import type { NextRequest } from 'next/server';

/**
 * ログアウト
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  const { userId, token } = await request.json();

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ status: 400, message: '必要な情報が不足しています。' }),
    );
  }

  // トークンの無効化
  const success = await deactivateAccessToken(userId, token);
  if (success) {
    return new Response(
      JSON.stringify({
        status: 200,
        message: 'トークンが正常に無効化されました。',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } else {
    return new Response(
      JSON.stringify({
        status: 400,
        message: 'トークンの無効化に失敗しました。',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
