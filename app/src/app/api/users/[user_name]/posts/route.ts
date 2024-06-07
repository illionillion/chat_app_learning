import mysql_connection from '@/lib/api/db/connection';
import { getLikedUsers } from '@/lib/api/post/like';
import { getRepostedUsers } from '@/lib/api/post/repost';
import type { RowDataPacket } from 'mysql2';
import type { NextRequest } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { user_name: string } },
) => {
  let connection;
  try {
    // リプライを取得する処理を実行する
    connection = await mysql_connection();
    const query =
      'SELECT p.post_id, p.user_id, p.content, p.image_path, p.like_count, p.repost_count, p.reply_count, p.created_at, u.user_name, u.display_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.is_deleted = 0 AND u.user_name = ?';
    const [result] = (await connection.execute(query, [
      params.user_name,
    ])) as RowDataPacket[];
    // 各postのlike取得
    const posts = await Promise.all(
      result.map(async (post: any) => {
        const likes = await getLikedUsers(post?.post_id);
        const reposts = await getRepostedUsers(post?.post_id);
        return { ...post, likes, reposts };
      }),
    );
    return new Response(
      JSON.stringify({
        posts: posts,
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
  } finally {
    if (connection) connection.destroy();
  }
};
