import { verifyAccessToken } from '@/lib/auth/saveToken';
import mysql_connection from '@/lib/db/connection';
import { updateLikeTotal } from '@/lib/post/like';
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
  const { userId, token } = await request.json();

  try {
    // トークン検証
    const isAuthenticated = await verifyAccessToken(userId, token);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          status: 401,
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 投稿のいいね
    const connection = await mysql_connection();

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
  }
};
