import { updateLikeTotal } from '@/lib/post/like';
import type { NextRequest } from 'next/server';

/**
 * いいね数の取得
 * @param request
 * @param param1
 * @returns
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { post_id: number } },
) => {
  const { post_id: postId } = params;

  try {
    const likeCount = await updateLikeTotal(postId);

    // レスポンスの構築
    return new Response(
      JSON.stringify({
        likeCount: likeCount,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Get like count error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
