import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import type { RowDataPacket } from 'mysql2';
import type { NextRequest } from 'next/server';

export const GET = async () => {
  try {
    // リプライを取得する処理を実行する
    const connection = await mysql_connection();
    const query =
      'SELECT p.post_id, p.user_id, p.content, p.image_path, p.like_count, p.repost_count, p.reply_count, p.created_at, u.user_name, u.display_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.is_deleted = 0';
    const [result] = (await connection.execute(query)) as RowDataPacket[];
    connection.destroy();

    return new Response(
      JSON.stringify({
        posts: result,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Get error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

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
      connection.destroy();
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
