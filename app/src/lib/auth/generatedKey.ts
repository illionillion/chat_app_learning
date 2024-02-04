import { randomBytes } from 'crypto';

/**
 * ランダム文字列生成
 * @param length
 * @returns
 */
export const generateSecureRandomString = (length: number = 32) => {
  // バイト単位のランダムなデータを生成
  const randomBytesData = randomBytes(Math.ceil(length / 2));

  // バイトデータを16進数文字列に変換
  const token = randomBytesData.toString('hex').slice(0, length);

  return token;
};
