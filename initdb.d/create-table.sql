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