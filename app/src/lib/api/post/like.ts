// lib/post/like.ts
import mysql_connection from '@/lib/api/db/connection';
import type { RowDataPacket } from 'mysql2';

/**
 * いいね数を更新し、更新後のいいね数を取得する
 * @param postId ポストID
 * @returns 更新後のいいね数
 */
export const updateLikeTotal = async (postId: number): Promise<number> => {
  let connection;
  try {
    connection = await mysql_connection();

    // いいね数の取得
    const query =
      'SELECT COUNT(*) AS likeCount FROM likes WHERE post_id = ? AND is_unliked = 0';
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];
    const likeCount = result[0]?.likeCount || 0;

    // postsテーブルへの反映
    const queryUpdatePost = 'UPDATE posts SET like_count = ? WHERE post_id = ?';
    await connection.execute(queryUpdatePost, [likeCount, postId]);
    return likeCount;
  } catch (error) {
    console.error('Update like total error:', error);
    throw error;
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * 投稿にいいねしているユーザーの取得
 * @param postId
 * @returns
 */
export const getLikedUsers = async (postId: number): Promise<number[]> => {
  let connection;
  try {
    connection = await mysql_connection();

    const query =
      'SELECT user_id FROM likes WHERE post_id = ? AND is_unliked = 0';
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];

    return result.map((post: any) => post?.user_id) as number[];
  } catch (error) {
    console.error('Get Likes postId error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};
