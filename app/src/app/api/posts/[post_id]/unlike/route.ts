import { verifyAccessToken } from "@/app/lib/auth/saveToken";
import mysql_connection from "@/app/lib/db/connection";
import { updateLikeTotal } from "@/app/lib/post/like";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";

/**
 * 投稿のいいね解除
 * @param request 
 * @param param1 
 * @returns 
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { post_id: number } }
) => {
  const { post_id: postId } = params;
  const { userId, token } = await request.json();

  try {
    // トークン認証
    const isAuthenticated = await verifyAccessToken(userId, token);
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({
          status: 401,
          message: "認証エラー。トークンが無効です。",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const connection = await mysql_connection();

    const query =
      "UPDATE likes SET is_unliked = 1 WHERE user_id = ? AND post_id = ? AND is_unliked = 0";
    const [result] = (await connection.execute(query, [
      userId,
      postId,
    ])) as RowDataPacket[];

    if (result.changedRows === 0) {
      return new Response(
        JSON.stringify({
          message:
            "投稿にいいねが存在しないか、いいねがすでに解除されています。",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await updateLikeTotal(postId);

    return new Response(
      JSON.stringify({
        message: "投稿のいいねを解除しました。",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Like error:", error);
    return new Response(
      JSON.stringify({ message: "サーバーエラーが発生しました。" }),
      {
        status: 400, // 例: 400 Bad Request
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
