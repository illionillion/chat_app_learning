import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import { createRoom } from '@/lib/api/message';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      {
        message: 'ユーザーIDが指定されていません。',
      },
      { status: 400 },
    );
  }

  // userIdを使ってデータを取得するなどの処理を行う

  return NextResponse.json(
    {
      message: 'ユーザーID: ' + userId,
    },
    { status: 200 },
  );
};

export const POST = async (request: NextRequest) => {
  const { users, userId } = (await request.json()) as {
    users: number[];
    userId: number;
  };
  const token = request.headers.get('Authorization');

  if (!users || !userId) {
    return NextResponse.json(
      {
        message: '値が指定されていません。',
      },
      { status: 400 },
    );
  }

  if (users.length < 2) {
    return NextResponse.json(
      {
        message: 'ユーザー数が足りません。',
      },
      { status: 400 },
    );
  }

  if (!token) {
    return NextResponse.json(
      {
        message: 'トークンが指定されていません。',
      },
      { status: 400 },
    );
  }

  const accessToken = token.replace('Bearer ', '').trim();
  // トークン検証
  const isAuthenticated = await verifyAccessToken(userId, accessToken);

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        message: '認証エラー。トークンが無効です。',
      },
      { status: 401 },
    );
  }

  // userIdがusersの中に含まれているかチェック
  if (!users.includes(userId)) {
    return NextResponse.json(
      {
        message:
          '不正な操作。自分以外のユーザーをルームに追加することはできません。',
      },
      { status: 403 },
    );
  }

  const { isSuccess, roomId } = await createRoom(users);

  if (!isSuccess) {
    if (!roomId) {
      return NextResponse.json(
        {
          message: 'チャットルームの作成に失敗しました。',
        },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        message: '既に同じメンバーでルームが作成されています。',
        room_id: roomId,
      },
      { status: 409 },
    );
  }

  return NextResponse.json(
    {
      message: 'チャットルームが正常に作成されました。',
      room_id: roomId,
    },
    { status: 201 },
  );
};
