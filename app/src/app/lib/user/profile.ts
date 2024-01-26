import mysql_connection from '@/app/lib/db/connection';
import type { RowDataPacket } from 'mysql2';

/**
 * ユーザー名からユーザーIDを取得
 * @param user_name ユーザー名
 * @returns ユーザーID
 */
export const getUserIdFromUserName = async (
  user_name: string,
): Promise<number | null> => {
  try {
    const connection = await mysql_connection();
    const query = 'SELECT id FROM users WHERE user_name = ?';
    const [result] = (await connection.execute(query, [
      user_name,
    ])) as RowDataPacket[];

    if (result.length > 0) {
      return result[0].id;
    } else {
      return null; // ユーザー名に対応するユーザーが見つからない場合
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

export interface UpdatedProfileDataType {
  description?: string;
  displayName?: string;
  iconPath?: string;
}

/**
 * プロフィール情報を更新
 * @param userId ユーザーID
 * @param updatedProfileData 更新するプロフィール情報
 * @returns 更新が成功したかどうか
 */
export const updateProfile = async (
  userId: number,
  updatedProfileData: UpdatedProfileDataType,
): Promise<boolean> => {
  try {
    const connection = await mysql_connection();

    // 更新クエリを構築
    const setClause: string[] = [];
    const setValues: any[] = [];

    if (updatedProfileData.displayName) {
      setClause.push('display_name = ?');
      setValues.push(updatedProfileData.displayName);
    }

    if (updatedProfileData.description !== undefined) {
      setClause.push('description = ?');
      setValues.push(updatedProfileData.description);
    }

    if (updatedProfileData.iconPath !== undefined) {
      setClause.push('icon_path = ?');
      setValues.push(updatedProfileData.iconPath);
    }

    // SET 句がある場合のみクエリを発行
    if (setClause.length > 0) {
      setValues.push(userId); // プレースホルダーをバインド

      const query = `UPDATE users SET ${setClause.join(', ')} WHERE id = ?`;
      const [result] = (await connection.execute(
        query,
        setValues,
      )) as RowDataPacket[];

      // 更新が成功したかどうかを確認
      return result.changedRows > 0;
    } else {
      // SET 句がない場合は何も更新せず成功とみなす
      return true;
    }
  } catch (error) {
    console.error('Error updating profile::', error);
    return false;
  }
};
