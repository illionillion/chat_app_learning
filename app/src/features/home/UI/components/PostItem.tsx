import type { PostData } from '@/lib/types/PostData';
import { Card, ListItem } from '@yamada-ui/react';
import type { FC } from 'react';

export const PostItem: FC<PostData> = ({ content }) => {
  return <ListItem as={Card}>{content}</ListItem>;
};
