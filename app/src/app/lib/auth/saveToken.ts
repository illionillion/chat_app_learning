import mysql_connection from "@/app/lib/db/connection";
import { generateSecureRandomString } from "./generatedKey";

const saveAccessTokenToDatabase = async (token: string, userId: number, expiryDate: Date) => {
    try {
        const connection = await mysql_connection();
        const formattedExpiryDate = expiryDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
        const query = "INSERT INTO access_tokens (token, user_id, expiry_date) VALUES (?, ?, ?)";
        await connection.execute(query, [token, userId, formattedExpiryDate]);
    } catch (error) {
        console.error("Failed to save access token to database:", error);
        throw error;
    }
};

export const issueAccessToken = async (userId: number) => {
    const accessToken = generateSecureRandomString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1); // 1時間後に有効期限が切れると仮定

    // データベースにアクセストークンを保存
    await saveAccessTokenToDatabase(accessToken, userId, expiryDate);

    return accessToken;
}
