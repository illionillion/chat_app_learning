import { createHash } from "crypto";

// パスワードをハッシュ化する関数
export const hashPassword = (password: string): string => {
    const hash = createHash("sha256");
    return hash.update(password).digest("hex");
};

// パスワードが一致するかどうかを比較する関数
export const comparePassword = (inputPassword: string, storedHash: string): boolean => {
    const hashedInputPassword = hashPassword(inputPassword);
    return hashedInputPassword === storedHash;
};
