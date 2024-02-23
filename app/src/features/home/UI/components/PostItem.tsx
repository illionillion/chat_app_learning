import type { PostData } from '@/lib/types/PostData';
import { Card, CardBody, CardHeader, ListItem, Text } from '@yamada-ui/react';
import type { FC } from 'react';

export const PostItem: FC<PostData> = ({
  user_name,
  display_name,
  created_at,
  content,
}) => {
  // 日時文字列をDateオブジェクトに変換
  const date = new Date(created_at);
  const convertJST = new Date(date);
  convertJST.setHours(convertJST.getHours() - 9);
  const formattedTime = convertJST.toLocaleString('ja-JP').slice(0, -3);
  return (
    <ListItem as={Card}>
      <CardHeader>
        <Text fontSize='xl'>{display_name}</Text>
        <Text fontSize='md' color='blackAlpha.500'>
          {user_name}
        </Text>
        <Text fontSize='sm' color='blackAlpha.500'>
          {formattedTime}
        </Text>
      </CardHeader>
      <CardBody>{content}</CardBody>
    </ListItem>
  );
};
