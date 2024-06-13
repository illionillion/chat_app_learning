import { verifyAccessToken } from '@/lib/api/auth/saveToken';
import { sendMessage } from '@/lib/api/message';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
