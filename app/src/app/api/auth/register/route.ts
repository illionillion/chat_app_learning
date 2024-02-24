import { hashPassword } from '@/lib/api/auth/password';
import { issueAccessToken } from '@/lib/api/auth/saveToken';
import mysql_connection from '@/lib/api/db/connection';
import type { NextRequest } from 'next/server';

/**
 * ユーザー登録
 * @param request
 */
export const POST = async (request: NextRequest) => {
  const body = await request.json();

  if (!body.userName || !body.displayName || !body.email || !body.password) {
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
    connection = await mysql_connection();
    const query =
      'INSERT INTO users (user_name, display_name, email, password) VALUES (?, ?, ?, ?)';
    const [result] = await connection.execute(query, [
      body.userName,
      body.displayName,
      body.email,
      hashPassword(body.password),
    ]);
    // ユーザーが正常に登録された場合、result.insertIdを使用して新しいユーザーのIDを取得
    const userId = (result as any).insertId as string;
    const accessToken = await issueAccessToken(parseInt(userId));
    return new Response(
      JSON.stringify({
        message: 'ユーザーが正常に登録されました。',
        userId: userId,
        userName: body.userName,
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    console.error('Regist error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } finally {
    if (connection) connection.destroy();
  }
};
