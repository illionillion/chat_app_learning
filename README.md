1. **環境構築:**

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

   - プロジェクトの依存関係をインストールするためのコマンド

   ```bash
   docker compose run --rm app npm i
   ```

2. **起動:**

   - プロジェクトを起動するためのコマンド

   ```bash
   docker compose up -d
   ```

  - MySQLへの接続コマンド
  ```bash
   docker exec -it db sh
   mysql -u root -p
   password
   ```

  - データベース接続
  ```bash
   show databases;
   use my_db;
   (MySQL操作時”;”を忘れないこと!!)

   ```

   - データベース内容確認
  ```bash
   show tables from my_db;
   select * from users;
   ```

  - プロジェクト終了
  ```bash
   docker compose down
   ```


3. **API エンドポイント:**

   - `POST /api/auth/register`

     - Description: 
       - ユーザーのアカウントを登録します。
     - Request Parameters:
       - `userName` (string): ユーザー名
       - `displayName` (string): 表示名
       - `email` (string): メールアドレス
       - `password` (string): パスワード
     - Response:
       - `message` (string): レスポンスメッセージ
       - `userId` (number): 登録されたユーザーの ID
       - `userName` (string): 登録されたユーザー名
       - `token` (string): アクセストークン

   - `POST /api/auth/login`
     - Description:
       - ユーザーのログインを行います。
     - Request Parameters:
       - `userName` (string): ユーザー名
       - `password` (string): パスワード
     - Response:
       - `message` (string): レスポンスメッセージ
       - `userId` (number): ログインしたユーザーの ID
       - `userName` (string): ログインしたユーザー名
       - `token` (string): アクセストークン
  
   - `POST /api/auth/verify`
     - Description:
       - ユーザーIDとアクセストークンの有効性を検証します。
     - Request Parameters:
       - `userId (number)`: ユーザーの一意のID
       - `token (string)`: ユーザーのアクセストークン
     -  Response:
     - 成功時
      - `status (number)`: 200
      - `authenticated (boolean)`: true
    - 失敗時
      - `status (number)`: 401
      - `authenticated (boolean)`: false