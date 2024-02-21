import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import type { RowDataPacket } from 'mysql2';
import type { NextRequest } from 'next/server';

/**
 * リプライの取得
 * @param request
 * @param param1
 * @returns
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { reply_id: number } },
) => {
  const { reply_id: replyId } = params;

  try {
    // リプライを取得する処理を実行する
    const connection = await mysql_connection();
    const query =
      'SELECT reply_id, user_id, post_id, parent_reply_id, reply_content, created_at FROM replies WHERE reply_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      replyId,
    ])) as RowDataPacket[];
    connection.release();

    if (result.length === 0) {
      return new Response(
        JSON.stringify({
          message: '指定されたリプライが見つかりませんでした。',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const reply = result[0];

    return new Response(
      JSON.stringify({
        replyId: reply.reply_id,
        userId: reply.user_id,
        postId: reply.post_id,
        parentReplyId: reply.parent_reply_id,
        createdAt: reply.created_at,
      }), // 最初のリプライを返す
      { status: 200, headers: { 'Content-Type': 'application/json' } },
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
 * リプライの削除
 * @param request
 * @param param1
 * @returns
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { reply_id: number } },
) => {
  const token = request.headers.get('Authorization');
  const { reply_id: replyId } = params;
  const { userId } = await request.json();

  if (!token || !replyId || !userId) {
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

    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          status: 401,
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // リプライを削除する処理を実行する
    const connection = await mysql_connection();
    const updateQuery =
      'UPDATE replies SET is_deleted = 1 WHERE reply_id = ? AND user_id = ?';
    const [result] = (await connection.execute(updateQuery, [
      replyId,
      userId,
    ])) as RowDataPacket[];
    connection.release();

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({
          message: '指定されたリプライが見つかりませんでした。',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ message: 'リプライが削除されました。' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
