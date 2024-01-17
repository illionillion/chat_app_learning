import mysql_connection from "@/app/lib/db/connection";
import { NextRequest } from "next/server";

/**
 * ユーザー登録
 * @param request 
 */
export const POST = async (request: NextRequest) => {
    const body = await request.json();

    if (
        !body.user_name ||
        !body.display_name ||
        !body.email ||
        !body.password
    ) {
      return new Response(JSON.stringify({ message: "空の入力値があります。" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const connection = await mysql_connection();
      const query =
        "INSERT INTO users (user_name, display_name, email, password) VALUES (?, ?, ?, SHA2(?, 256))";
      await connection.execute(query, [body.user_name, body.display_name, body.email, body.password]);
  
      return new Response(JSON.stringify({ message: "送信に成功しました。" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: "送信に失敗しました。" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}