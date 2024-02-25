import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import type { RowDataPacket } from 'mysql2';
import type { NextRequest } from 'next/server';
/**
 * 投稿の取得
 * @param request
 * @param param1
 * @returns
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { post_id: number } },
) => {
  const { post_id: postId } = params;
  let connection;
  try {
    // 投稿の取得
    connection = await mysql_connection();
    const query =
      'SELECT post_id, user_id, content, image_path, like_count, repost_count, reply_count, created_at FROM posts WHERE post_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];
    if (result.length > 0) {
      const post = result[0];
      return new Response(
        JSON.stringify({
          postId: post.postId,
          userId: post.user_id,
          content: post.content,
          imagePath: post.image_path,
          likeCount: post.like_count,
          repostCount: post.repost_count,
          replyCount: post.reply_count,
          createdAt: post.created_at,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          message: 'Post not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(
      JSON.stringify({
        message: 'Server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * 投稿の削除
 * @param request
 * @param param1
 * @returns
 */
export const DELETE = async (
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
          status: 401,
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 投稿の更新（論理削除）
    connection = await mysql_connection();
    const query =
      'UPDATE posts SET is_deleted = 1 WHERE post_id = ? AND user_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      postId,
      userId,
    ])) as RowDataPacket[];

    // 更新が成功した場合
    if (result.affectedRows > 0) {
      return new Response(
        JSON.stringify({
          message: '投稿が正常に削除されました。',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      // 更新対象の投稿が見つからない場合
      return new Response(
        JSON.stringify({
          message: '投稿が見つかりません。',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    return new Response(
      JSON.stringify({
        message: 'サーバーエラーが発生しました。',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } finally {
    if (connection) connection.destroy();
  }
};
