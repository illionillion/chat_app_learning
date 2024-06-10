export type PostData = {
  post_id: number;
  user_id: number;
  user_name: string;
  display_name: string;
  content: string;
  image_path: string;
  like_count: number;
  repost_count: number;
  reply_count: number;
  created_at: string;
  likes: number[];
  reposts: number[];
};
