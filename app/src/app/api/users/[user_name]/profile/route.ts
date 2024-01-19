import mysql_connection from "@/app/lib/db/connection";
import { NextRequest } from "next/server";
import { RowDataPacket } from "mysql2";

/**
 * ユーザー情報の取得
 * @returns
 */
export const GET = async (
  request: NextRequest,
  { params }: { params: { user_name: string } }
) => {
  const { user_name } = params;
  try {
    const connection = await mysql_connection();
    const query =
      "SELECT id, user_name, display_name, description, icon_path FROM users WHERE user_name = ?";
    const [result] = (await connection.execute(query, [
      user_name,
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
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error fetching user:", error);
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
