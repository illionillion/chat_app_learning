import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import type { NextRequest } from 'next/server';

/**
 * 投稿の作成
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  const token = request.headers.get('Authorization');
  const { userId, content } = await request.json();

  if (!userId || !content || !token) {
    return new Response(
      JSON.stringify({ message: '必要な情報が不足しています。' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const accessToken = token.replace('Bearer ', '').trim();
    // トークン検証
    const isAuthenticated = await verifyAccessToken(userId, accessToken);

    if (isAuthenticated) {
      // 投稿の作成
      const connection = await mysql_connection();
      const query =
        'INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, now())';
      const [result] = await connection.execute(query, [userId, content]);

      const postId = (result as any).insertId as string;

      return new Response(
        JSON.stringify({
          message: '投稿が正常に作成されました。',
          postId: postId,
          content: content,
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          status: 401,
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }
  } catch (error) {
    console.error('Post error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
