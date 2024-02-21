import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import type { NextRequest } from 'next/server';

/**
 * リプライの作成
 * @param request
 * @param param1
 * @returns
 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { post_id: number } },
) => {
  const token = request.headers.get('Authorization');

  const { userId, postId, parentReplyId, replyContent } = await request.json();
  if (
    !userId ||
    !postId ||
    postId != params.post_id ||
    !replyContent ||
    !token
  ) {
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
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 投稿の作成
    const connection = await mysql_connection();

    const query =
      'INSERT INTO replies (user_id, post_id, parent_reply_id, reply_content, created_at) VALUES (?, ?, ?, ?, now())';
    const [result] = await connection.execute(query, [
      userId,
      postId,
      parentReplyId ? parentReplyId : null,
      replyContent,
    ]);
    connection.release();
    const replyId = (result as any).insertId as string;

    return new Response(
      JSON.stringify({
        message: 'リプライが正常に作成されました。',
        replyId: replyId,
        content: replyContent,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
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
