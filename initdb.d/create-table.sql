-- ユーザーテーブル
create table users (
    id int auto_increment primary key, -- id（主キー）
    user_name varchar(255) not null unique, -- ユーザー名（一意キーにしても良い）
    display_name varchar(255) not null, -- ユーザー名（一意キーにしても良い）
    email varchar(255) not null unique, -- メールアドレス（同じく一意キーにしても良い）
    password varchar(255) not null, -- パスワード（ハッシュ化してもそのままでも良し）
    description varchar(255) default '', -- 説明
    icon_path varchar(255) default '' -- アイコン画像のパス
);

-- ユーザーの初期データ追加
insert into users (user_name, display_name, email, password, icon_path) values 
('Yusuke', 'ユースケ', 'tanaka@email.com', SHA2('password', 256), ''), -- パスワードをハッシュ化して保存
('toku', 'とく', 'toto@email.com', SHA2('password', 256), '/public/image/2.png'), -- アイコンのURL保存する場合
('Umi', '海', 'umiumi@email.com', SHA2('password', 256), ''),
('Lucky', 'Lucky', 'Lucky@email.com', SHA2('password', 256), ''),
('Kazuki', '一樹', 'kazu@email.com', SHA2('password', 256), '');

-- アクセストークンの管理テーブル
CREATE TABLE access_tokens (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 投稿の管理テーブル
CREATE TABLE posts (
    post_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_path VARCHAR(255),
    like_count INT DEFAULT 0,
    repost_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    created_at DATETIME NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- いいねの管理テーブル
CREATE TABLE likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- リポストの管理テーブル
CREATE TABLE reposts (
    repost_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- リプライの管理テーブル
CREATE TABLE replies (
    reply_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    parent_reply_id INT, -- 親リプライのID
    reply_text TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id),
    FOREIGN KEY (parent_reply_id) REFERENCES replies(reply_id)
);
