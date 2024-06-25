import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import { getMessages, sendMessage } from '@/lib/api/message';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const GET = async (
  request: NextRequest,
  { params }: { params: { room_id: string } },
) => {
  const { room_id } = params;
  if (isNaN(parseInt(room_id))) {
    return NextResponse.json(
      {
        message: '値が不正です・',
      },
      {
        status: 400,
      },
    );
  }

  const userId = request.nextUrl.searchParams.get('userId');
  const token = request.headers.get('Authorization');

  if (!userId || isNaN(parseInt(userId))) {
    return NextResponse.json(
      {
        message: 'ユーザーIDが指定されていません。',
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
  const isAuthenticated = await verifyAccessToken(
    parseInt(userId),
    accessToken,
  );

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        message: '認証エラー。トークンが無効です。',
      },
      { status: 401 },
    );
  }

  const { isSuccess, messages, message, partner } = await getMessages(
    parseInt(room_id),
    parseInt(userId),
  );

  if (!isSuccess) {
    return NextResponse.json(
      {
        message,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      messages,
      partner,
    },
    { status: 200 },
  );
};

export const POST = async (
  request: NextRequest,
  { params }: { params: { room_id: string } },
) => {
  const { room_id } = params;
  if (isNaN(parseInt(room_id))) {
    return NextResponse.json(
      {
        message: '値が不正です・',
      },
      {
        status: 400,
      },
    );
  }
  const { senderId, receiverId, content } = (await request.json()) as {
    senderId: number;
    receiverId: number;
    content: string;
  };

  if (!senderId || !receiverId || !content) {
    return NextResponse.json({
      message: '値が指定されていません。',
    });
  }

  const token = request.headers.get('Authorization');

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
  const isAuthenticated = await verifyAccessToken(senderId, accessToken);

  if (!isAuthenticated) {
    return NextResponse.json(
      {
        message: '認証エラー。トークンが無効です。',
      },
      { status: 401 },
    );
  }

  const roomId = parseInt(room_id);

  const { isSuccess, message } = await sendMessage(
    roomId,
    senderId,
    receiverId,
    content,
  );

  if (!isSuccess) {
    return NextResponse.json(
      {
        message,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json(
    {
      message,
    },
    { status: 200 },
  );
};
