import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db/connection';

/**
 * リポスト数を更新し、取得
 * @param postId
 * @returns
 */
export const updateRepostTotal = async (postId: number): Promise<number> => {
  let connection;
  try {
    connection = await mysql_connection();

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
    return repostCount;
  } catch (error) {
    console.error('Update repost total error:', error);
    throw error;
  } finally {
    if (connection) connection.destroy();
  }
};

/**
 * すでにリポストしているユーザーの取得
 * @param postId
 * @returns
 */
export const getRepostedUsers = async (postId: number): Promise<number[]> => {
  let connection;
  try {
    connection = await mysql_connection();
    const query =
      'SELECT user_id FROM reposts WHERE post_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];

    return result.map((post: any) => post?.user_id) as number[];
  } catch (error) {
    console.error('Get Reposts postId error:', error);
    return [];
  } finally {
    if (connection) connection.destroy();
  }
};
