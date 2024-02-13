import mysql_connection from '@/lib/db/connection';
import type { NextRequest } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { verifyAccessToken } from '@/lib/auth/saveToken';
import { getUserIdFromUserName, updateProfile } from '@/lib/user/profile';

/**
 * ユーザープロフィール情報の取得
 * @returns
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { user_name: string } },
) => {
  const { user_name: userName } = params;
  try {
    const connection = await mysql_connection();
    const query =
      'SELECT id, user_name, display_name, description, icon_path FROM users WHERE user_name = ?';
    const [result] = (await connection.execute(query, [
      userName,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      const user = result[0];

      return new Response(
        JSON.stringify({
          userId: user.id,
          userName: user.user_name,
          displayName: user.display_name,
          description: user.description,
          iconPath: user.icon_path,
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          message: 'User not found',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return new Response(
      JSON.stringify({
        message: 'Server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};

/**
 * ユーザープロフィールの更新
 * @param request
 * @param param1
 * @returns
 */
export const PUT = async (
  request: NextRequest,
  { params }: { params: { user_name: string } },
) => {
  const { updatedProfileData } = await request.json();
  const token = request.headers.get('Authorization');
  const { user_name: userName } = params;

  // ユーザー名からユーザーIDを取得
  const userId = await getUserIdFromUserName(userName);

  if (!userId) {
    return new Response(
      JSON.stringify({
        message: 'User not found',
      }),
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  if (!token) {
    return new Response(
      JSON.stringify({
        message: 'トークンがありません。',
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const accessToken = token.replace('Bearer ', '').trim();
  // トークンの検証
  const isAuthenticated = await verifyAccessToken(userId, accessToken);

  if (isAuthenticated) {
    // ユーザーが提供したデータでプロフィール情報を更新
    const success = await updateProfile(userId, updatedProfileData);

    if (success) {
      return new Response(
        JSON.stringify({
          message: 'プロフィール情報が更新されました。',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    } else {
      return new Response(
        JSON.stringify({
          message: 'プロフィール情報の更新に失敗しました。',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }
  } else {
    return new Response(
      JSON.stringify({
        message: '認証エラー。トークンが無効です。',
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
