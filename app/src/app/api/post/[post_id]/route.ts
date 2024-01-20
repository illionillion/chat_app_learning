import mysql_connection from "@/app/lib/db/connection";
import { RowDataPacket } from "mysql2";
import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { post_id: number } }
) => {
  const { post_id: postId } = params;
  try {
    // 投稿の取得
    const connection = await mysql_connection();
    const query =
      "SELECT post_id, user_id, content, image_path, like_count, repost_count, reply_count, created_at FROM posts WHERE post_id = ?";
    const [result] = (await connection.execute(query, [
      postId,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      const post = result[0];
      return new Response(
        JSON.stringify({
          postId: post.postId,
          userId: post.user_id,
          content: post.content,
          imagePath: post.image_path,
          likeCount: post.like_count,
          repostCount: post.repost_count,
          replyCount: post.reply_count,
          createdAt: post.created_at,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "Post not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    return new Response(
      JSON.stringify({
        message: "Server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
