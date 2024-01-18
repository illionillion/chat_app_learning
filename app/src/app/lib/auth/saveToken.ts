import mysql_connection from "@/app/lib/db/connection";
import { generateSecureRandomString } from "./generatedKey";
import { RowDataPacket } from "mysql2";

/**
 * アクセストークンの保存
 * @param token 
 * @param userId 
 * @param expiryDate 
 */
const saveAccessTokenToDatabase = async (
  token: string,
  userId: number,
  expiryDate: Date
) => {
  try {
    const connection = await mysql_connection();
    const formattedExpiryDate = expiryDate.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
    });
    const query =
      "INSERT INTO access_tokens (token, user_id, expiry_date) VALUES (?, ?, ?)";
    await connection.execute(query, [token, userId, formattedExpiryDate]);
  } catch (error) {
    console.error("Failed to save access token to database:", error);
    throw error;
  }
};

/**
 * ユーザーIDでアクセストークンの取得
 * @param userId 
 * @returns 
 */
const getAccessTokenByUserId = async (
  userId: number
): Promise<string | null> => {
  try {
    const connection = await mysql_connection();
    const query =
      "SELECT token FROM access_tokens WHERE user_id = ? AND expiry_date > NOW()";
    const [result] = (await connection.execute(query, [
      userId,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      return result[0].token;
    }

    return null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw error;
  }
};

/**
 * アクセストークンの発行
 * @param userId 
 * @returns 
 */
export const issueAccessToken = async (userId: number): Promise<string> => {
  // 既存のアクセストークンを取得
  const existingToken = await getAccessTokenByUserId(userId);

  if (existingToken) {
    // 既存のアクセストークンが存在する場合はそれを再利用
    return existingToken;
  }

  // 既存のアクセストークンがない場合は新しいアクセストークンを発行
  const accessToken = generateSecureRandomString();
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // 1時間後に有効期限が切れると仮定

  // データベースにアクセストークンを保存
  await saveAccessTokenToDatabase(accessToken, userId, expiryDate);

  return accessToken;
};