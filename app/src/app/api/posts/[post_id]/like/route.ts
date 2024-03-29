import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import { updateLikeTotal } from '@/lib/api/post/like';
import type { RowDataPacket } from 'mysql2';
import type { NextRequest } from 'next/server';

/**
 * 投稿にいいねする
 * @param request
 * @param param1
 * @returns
 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { post_id: number } },
) => {
  const { post_id: postId } = params;
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
  let connection;
  try {
    const accessToken = token.replace('Bearer ', '').trim();
    // トークン検証
    const isAuthenticated = await verifyAccessToken(userId, accessToken);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 投稿のいいね
    connection = await mysql_connection();

    const [existingLikes] = (await connection.execute(
      'SELECT * FROM likes WHERE user_id = ? AND post_id = ? AND is_unliked = 0',
      [userId, postId],
    )) as RowDataPacket[];

    if (existingLikes.length > 0) {
      // 既にいいねが存在する場合の処理
      return new Response(
        JSON.stringify({
          message: '既に投稿にいいねされています。',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const query =
      'INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, now())';
    const [result] = (await connection.execute(query, [
      userId,
      postId,
    ])) as RowDataPacket[];

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({
          message: '投稿にいいねされませんでした。',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    await updateLikeTotal(postId);

    return new Response(
      JSON.stringify({
        message: '投稿にいいねされました。',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Like error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      {
        status: 400, // 例: 400 Bad Request
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } finally {
    if (connection) connection.destroy();
  }
};
