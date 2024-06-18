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

export const sendMessage = async (
  roomId: number,
  senderId: number,
  receiverId: number,
  content: string,
) => {
  let connection: PoolConnection | null = null;

  if (senderId === receiverId) {
    return {
      isSuccess: false,
      message: '自分自身にメッセージを送信することはできません。',
    };
  }

  try {
    connection = await mysql_connection();

    // 指定されたチャットルームが存在するかを確認するクエリ
    const [roomResult] = (await connection.execute(
      'SELECT * FROM message_room WHERE room_id = ? LIMIT 1',
      [roomId],
    )) as RowDataPacket[];

    // 指定されたチャットルームが存在しない場合はエラーを返す
    if (roomResult.length === 0) {
      return {
        isSuccess: false,
        message: '指定されたチャットルームが存在しません。',
      };
    }

    // チャットルームに参加しているユーザーを取得するクエリ
    const [usersResult] = (await connection.execute(
      'SELECT user_id FROM message_relation WHERE room_id = ? ',
      [roomId],
    )) as RowDataPacket[];

    // チャットルームに参加しているユーザーのIDの配列を作成
    const participants = usersResult.map((row: any) => row.user_id);

    // 送信者と受信者の両方がチャットルームに参加しているかを確認
    if (
      !participants.includes(senderId) ||
      !participants.includes(receiverId)
    ) {
      return {
        isSuccess: false,
        message: '送信者または受信者がチャットルームに参加していません。',
      };
    }

    // メッセージを送信する処理を実行する（ここで実装）
    await connection.execute(
      `insert into message
      (room_id, sender_id, message_content) 
      values
      (?, ?, ?)
      `,
      [roomId, senderId, content],
    );

    return { isSuccess: true, message: 'メッセージを送信しました。' };
  } catch (error) {
    console.error('SendMessage Error: ', error);
    return { isSuccess: false, message: 'メッセージの送信に失敗しました。' };
  } finally {
    if (connection) connection.release();
  }
};

export const getMessages = async (roomId: number, userId: number) => {
  let connection: PoolConnection | null = null;

  try {
    connection = await mysql_connection();

    // 指定されたチャットルームにユーザーが属しているか確認
    const [participants] = (await connection.execute(
      'SELECT user_id FROM message_relation WHERE room_id = ? AND user_id = ?',
      [roomId, userId],
    )) as RowDataPacket[];

    if (participants.length === 0) {
      return {
        isSuccess: false,
        message: 'このユーザーは指定されたチャットルームに参加していません。',
      };
    }

    // メッセージ一覧を取得
    const [messagesResult] = (await connection.execute(
      `SELECT 
          m.message_id, 
          m.room_id, 
          m.sender_id, 
          m.message_content, 
          m.sent_at 
       FROM 
          message m
       WHERE 
          m.room_id = ?`,
      [roomId],
    )) as RowDataPacket[];

    const messages = messagesResult.map((message: any) => ({
      messageId: message.message_id,
      roomId: message.room_id,
      senderId: message.sender_id,
      content: message.message_content,
      sentAt: message.sent_at,
    }));

    return { isSuccess: true, messages };
  } catch (error) {
    console.error('GetMessages Error: ', error);
    return { isSuccess: false, message: 'メッセージの取得に失敗しました。' };
  } finally {
    if (connection) connection.release();
  }
};
