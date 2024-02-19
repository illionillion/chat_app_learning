import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db/connection';

/**
 * リポスト数を更新し、取得
 * @param postId
 * @returns
 */
export const updateRepostTotal = async (postId: number): Promise<number> => {
  try {
    const connection = await mysql_connection();

    // リポスト数の取得
    const query =
      'SELECT COUNT(*) AS repostCount FROM reposts WHERE post_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];
    const repostCount = result[0]?.repostCount || 0;

    // postsテーブルへの反映
    const queryUpdatePost =
      'UPDATE posts SET repost_count = ? WHERE post_id = ?';
    await connection.execute(queryUpdatePost, [repostCount, postId]);
    connection.release();
    return repostCount;
  } catch (error) {
    console.error('Update repost total error:', error);
    throw error;
  }
};
