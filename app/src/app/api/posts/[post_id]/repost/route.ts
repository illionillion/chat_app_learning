import { verifyAccessToken } from '@/lib/auth/saveToken';
import mysql_connection from '@/lib/db/connection';
import { updateRepostTotal } from '@/lib/post/repost';
import type { RowDataPacket } from 'mysql2';
import type { NextRequest } from 'next/server';

/**
 * リポストの作成
 * @param request
 * @param param1
 * @returns
 */
export const POST = async (
  request: NextRequest,
  { params }: { params: { post_id: number } },
) => {
  const { post_id: postId } = params;
  const { userId } = await request.json();
  const token = request.headers.get('Authorization');

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ message: '必要な情報が不足しています。' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const accessToken = token.replace('Bearer ', '').trim();
    // トークン検証
    const isAuthenticated = await verifyAccessToken(userId, accessToken);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // 投稿のリポスト
    const connection = await mysql_connection();

    const [existingRepost] = (await connection.execute(
      'SELECT * FROM reposts WHERE user_id = ? AND post_id = ? AND is_deleted = 0',
      [userId, postId],
    )) as RowDataPacket[];

    if (existingRepost.length > 0) {
      // 既にリポストが存在する場合の処理
      return new Response(
        JSON.stringify({
          message: '既に投稿にリポストされています。',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const query =
      'INSERT INTO reposts (user_id, post_id, created_at) VALUES (?, ?, now())';
    const [result] = (await connection.execute(query, [
      userId,
      postId,
    ])) as RowDataPacket[];

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({
          message: '投稿をリポストしませんでした。',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // リポスト数の更新
    await updateRepostTotal(postId);

    return new Response(
      JSON.stringify({
        message: '投稿をリポストしました。',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Repost error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      {
        status: 400, // 例: 400 Bad Request
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};

/**
 * リポストの削除
 * @param request
 * @param param1
 * @returns
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { post_id: number } },
) => {
  const { post_id: postId } = params;
  const { userId } = await request.json();
  const token = request.headers.get('Authorization');

  if (!userId || !token) {
    return new Response(
      JSON.stringify({ message: '必要な情報が不足しています。' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  try {
    const accessToken = token.replace('Bearer ', '').trim();
    // トークン認証
    const isAuthenticated = await verifyAccessToken(userId, accessToken);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          message: '認証エラー。トークンが無効です。',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const connection = await mysql_connection();

    // リポストの削除
    const query =
      'UPDATE reposts SET is_deleted = 1 WHERE user_id = ? AND post_id = ? AND is_deleted = 0';
    const [result] = (await connection.execute(query, [
      userId,
      postId,
    ])) as RowDataPacket[];

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({
          message: 'リポストされていないか、すでにリポストが削除されてます。',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // リポスト数の更新
    await updateRepostTotal(postId);

    return new Response(
      JSON.stringify({
        message: 'リポストを削除しました。',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Repost error:', error);
    return new Response(
      JSON.stringify({ message: 'サーバーエラーが発生しました。' }),
      {
        status: 400, // 例: 400 Bad Request
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
