1. **環境構築:**

   - プロジェクトの依存関係をインストールするためのコマンド

   ```bash
   docker compose run --rm app npm i
   ```

2. **起動:**

   - プロジェクトを起動するためのコマンド

   ```bash
   docker compose up -d
   ```

3. **環境変数:**

   - `.env` ファイルに必要な環境変数の設定

   ```env
   MYSQL_HOST=mysql
   MYSQL_USER=root
   MYSQL_PORT=3306
   MYSQL_PASSWORD=password
   MYSQL_DATABASE=my_db
   TZ=Asia/Tokyo
   NEXTJS_PORT=8080
   ```

4. **API エンドポイント:**

   - 実装されている API のエンドポイント、パラメータ、およびレスポンスに関する情報を列挙

   - `POST /api/auth/register`

     - Description: ユーザーのアカウントを登録します。
     - Request Parameters:
       - `user_name` (string): ユーザー名
       - `display_name` (string): 表示名
       - `email` (string): メールアドレス
       - `password` (string): パスワード
     - Response:
       - `message` (string): レスポンスメッセージ
       - `userId` (number): 登録されたユーザーの ID
       - `userName` (string): 登録されたユーザー名
       - `token` (string): アクセストークン

   - `POST /api/auth/login`
     - Description: ユーザーのログインを行います。
     - Request Parameters:
       - `user_name` (string): ユーザー名
       - `password` (string): パスワード
     - Response:
       - `message` (string): レスポンスメッセージ
       - `userId` (number): ログインしたユーザーの ID
       - `userName` (string): ログインしたユーザー名
       - `token` (string): アクセストークン
