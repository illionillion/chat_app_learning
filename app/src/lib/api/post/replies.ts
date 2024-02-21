import type { RowDataPacket } from 'mysql2';
import mysql_connection from '../db/connection';

export const updateReplyTotal = async (postId: number): Promise<number> => {
  try {
    const connection = await mysql_connection();
    // リプライ数の取得
    const query =
      'SELECT COUNT(*) as replyCount FROM replies where post_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];
    const replyCount = result[0]?.replyCount || 0;
    // repliesテーブルへの反映
    const queryUpdatePost =
      'UPDATE posts SET reply_count = ? WHERE post_id = ?';
    await connection.execute(queryUpdatePost, [replyCount, postId]);
    connection.release();
    console.log('postId:', postId);
    console.log('replyCount:', replyCount);

    return replyCount;
  } catch (error) {
    console.error('Update reply total error:', error);
    throw error;
  }
};
