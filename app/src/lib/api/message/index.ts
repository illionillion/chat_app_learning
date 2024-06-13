import type { RowDataPacket, PoolConnection } from 'mysql2/promise';
import mysql_connection from '../db/connection';

export const createRoom = async (users: number[]) => {
  let connection: PoolConnection | null = null;
  try {
    connection = await mysql_connection();

    // ユーザーの組み合わせで既存のルームをチェック
    const placeholders = users.map(() => '?').join(',');
    const [existingRooms] = (await connection.execute(
      `SELECT room_id 
       FROM message_relation 
       WHERE user_id IN (${placeholders}) 
       GROUP BY room_id 
       HAVING COUNT(DISTINCT user_id) = ?`,
      [...users, users.length],
    )) as RowDataPacket[];

    if (existingRooms.length > 0) {
      return { isSuccess: false, roomId: existingRooms[0].room_id };
    }

    // チャットルームの作成
    const [roomResult] = (await connection.execute(
      'INSERT INTO message_room () VALUES ();',
    )) as RowDataPacket[];

    // 挿入されたチャットルームIDを取得
    const roomId = (roomResult as any).insertId;

    // message_relationテーブルへの関連付けの挿入
    const relationPromises = users.map((userId) =>
      connection!.execute(
        'INSERT INTO message_relation (user_id, room_id) VALUES (?, ?);',
        [userId, roomId],
      ),
    );
    await Promise.all(relationPromises);

    return { isSuccess: true, roomId };
  } catch (error) {
    console.error('CreateRoom Error: ', error);
    return { isSuccess: false };
  } finally {
    if (connection) connection.release();
  }
};

export const getRooms = async (userId: number) => {
  let connection: PoolConnection | null = null;

  try {
    connection = await mysql_connection();

    // ユーザーが参加しているルームの一覧を取得
    const [result] = (await connection.execute(
      `SELECT 
          mr.room_id, 
          u.id AS partner_id, 
          u.user_name AS partner_username
       FROM 
          message_relation mr
       JOIN 
          users u ON mr.user_id != ? AND mr.room_id IN (
            SELECT room_id 
            FROM message_relation 
            WHERE user_id = ?
          ) AND mr.user_id = u.id`,
      [userId, userId],
    )) as RowDataPacket[];

    const rooms = (
      result as {
        room_id: number;
        partner_id: number;
        partner_username: string;
      }[]
    ).map((v) => ({
      roomId: v.room_id,
      partnerId: v.partner_id,
      partnerUsername: v.partner_username,
    }));

    return { isSuccess: true, rooms };
  } catch (error) {
    console.error('GetRooms Error: ', error);
    return { isSuccess: false, rooms: [] };
  } finally {
    if (connection) connection.release();
  }
};
