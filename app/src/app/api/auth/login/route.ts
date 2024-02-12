import mysql_connection from '@/lib/db/connection';
import { issueAccessToken } from '@/lib/auth/saveToken';
import type { NextRequest } from 'next/server';
import { comparePassword } from '@/lib/auth/password';
import type { RowDataPacket } from 'mysql2';

/**
 * ログイン
 * @param request
 * @returns
 */
export const POST = async (request: NextRequest) => {
  const body = await request.json();

  if (!body.userName || !body.password) {
    return new Response(
      JSON.stringify({ message: '必要な情報が不足しています。' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const connection = await mysql_connection();
    const query =
      'SELECT id, user_name, password FROM users WHERE user_name = ?';
    const [result] = (await connection.execute(query, [
      body.userName,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      const user = result[0];
      const passwordMatch = comparePassword(body.password, user.password);

      if (passwordMatch) {
        // パスワードが一致した場合、アクセストークンを発行
        const accessToken = await issueAccessToken(user.id);

        return new Response(
          JSON.stringify({
            message: 'ログインに成功しました。',
            userId: user.id,
            userName: user.user_name,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
      } else {
        return new Response(
          JSON.stringify({
            message: 'パスワードが正しくありません。',
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }
    }

    return new Response(
      JSON.stringify({
        message: 'ユーザー名が正しくありません。',
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
