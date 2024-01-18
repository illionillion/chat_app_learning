import { hashPassword } from "@/app/lib/auth/password";
import { issueAccessToken } from "@/app/lib/auth/saveToken";
import mysql_connection from "@/app/lib/db/connection";
import { NextRequest } from "next/server";

/**
 * ユーザー登録
 * @param request
 */
export const POST = async (request: NextRequest) => {
  const body = await request.json();

  if (!body.user_name || !body.display_name || !body.email || !body.password) {
    return new Response(
      JSON.stringify({ message: "必要な情報が不足しています。" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const connection = await mysql_connection();
    const query =
      "INSERT INTO users (user_name, display_name, email, password) VALUES (?, ?, ?, ?)";
    const [result] = await connection.execute(query, [
      body.user_name,
      body.display_name,
      body.email,
      hashPassword(body.password),
    ]);

    // ユーザーが正常に登録された場合、result.insertIdを使用して新しいユーザーのIDを取得
    const userId = (result as any).insertId as string;

    return new Response(
      JSON.stringify({
        message: "ユーザーが正常に登録されました。",
        userId: userId,
        userName: body.user_name,
        token: await issueAccessToken(parseInt(userId)),
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "サーバーエラーが発生しました。" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
