import type { PostData } from '@/lib/types/PostData';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ListItem,
  Text,
  VStack,
} from '@yamada-ui/react';
import { Heart, MessageSquare, Repeat2 } from 'lucide-react';
import type { FC } from 'react';

export const PostItem: FC<PostData> = ({
  user_name,
  display_name,
  created_at,
  content,
  like_count,
  repost_count,
  reply_count,
}) => {
  // 日時文字列をDateオブジェクトに変換
  const date = new Date(created_at);
  const convertJST = new Date(date);
  convertJST.setHours(convertJST.getHours() - 9);
  const formattedTime = convertJST.toLocaleString('ja-JP').slice(0, -3);
  return (
    <ListItem as={Card} flexDir='row'>
      <Box pt='md' pl='md'>
        <Avatar />
      </Box>
      <VStack gap={0}>
        <CardHeader pl='sm'>
          <Text fontSize='xl'>{display_name}</Text>
          <Text fontSize='md' color='blackAlpha.500'>
            {user_name}
          </Text>
          <Text fontSize='sm' color='blackAlpha.500'>
            {formattedTime}
          </Text>
        </CardHeader>
        <CardBody pl='sm' pt={0}>
          <Text as='pre'>{content}</Text>
        </CardBody>
        <CardFooter pl='sm'>
          <Button
            variant='ghost'
            size='xs'
            gap={1}
            leftIcon={<MessageSquare size='16px' />}
          >
            {reply_count}
          </Button>
          <Button
            variant='ghost'
            size='xs'
            gap={1}
            leftIcon={<Repeat2 size='16px' />}
          >
            {repost_count}
          </Button>
          <Button
            variant='ghost'
            size='xs'
            gap={1}
            leftIcon={<Heart size='16px' />}
          >
            {like_count}
          </Button>
        </CardFooter>
      </VStack>
    </ListItem>
  );
};
