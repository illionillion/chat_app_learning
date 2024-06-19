import mysql_connection from '@/lib/api/db/connection';
import type { RowDataPacket } from 'mysql2';
import { NextResponse } from 'next/server';

export const GET = async () => {
  let connection;

  try {
    connection = await mysql_connection();

    const query =
      'SELECT id, user_name, display_name, description, icon_path FROM users';
    const [result] = (await connection.execute(query)) as RowDataPacket[];

    const users = (
      result as {
        id: number;
        user_name: string;
        display_name: string;
        description: string;
        icon_path: string;
      }[]
    ).map((user) => ({
      userId: user.id,
      userName: user.user_name,
      displayName: user.display_name,
      description: user.description,
      iconPath: user.icon_path,
    }));

    return NextResponse.json(
      {
        users,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Get Users Error:', error);
    return NextResponse.json(
      {
        message: 'サーバーエラー',
      },
      {
        status: 500,
      },
    );
  } finally {
    if (connection) connection.release();
  }
};
