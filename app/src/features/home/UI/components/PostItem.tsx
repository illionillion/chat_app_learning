import { StateContext } from '@/lib/components/state/authContext';
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
  useNotice,
} from '@yamada-ui/react';
import { Heart, MessageSquare, Repeat2 } from 'lucide-react';
import { useContext, type FC, useState } from 'react';

export const PostItem: FC<PostData> = ({
  post_id,
  user_name,
  display_name,
  created_at,
  content,
  like_count,
  repost_count,
  reply_count,
  likes,
}) => {
  // 日時文字列をDateオブジェクトに変換
  const date = new Date(created_at);
  const convertJST = new Date(date);
  convertJST.setHours(convertJST.getHours() - 9);
  const formattedTime = convertJST.toLocaleString('ja-JP').slice(0, -3);
  const { userData } = useContext(StateContext);
  const notice = useNotice();
  const [isLiked, setIsLiked] = useState<boolean>(
    likes.includes(userData?.userId || 0),
  );
  const [likeTotal, setLikeTotal] = useState<number>(like_count);
  const [isReposted, setIsReposted] = useState<boolean>(
    likes.includes(userData?.userId || 0),
  );
  const [repostTotal, setRepostTotal] = useState<number>(repost_count);
  const handleLikeClick = async () => {
    try {
      const response = await fetch(`/api/posts/${post_id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          userId: userData?.userId,
        }),
      });
      if (response.ok) {
        notice({
          title: '投稿にいいねされました。',
          placement: 'bottom',
          status: 'success',
          isClosable: true,
        });
        setIsLiked(true);
        setLikeTotal((prev) => prev + 1);
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnLikeClick = async () => {
    try {
      const response = await fetch(`/api/posts/${post_id}/unlike`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          userId: userData?.userId,
        }),
      });
      if (response.ok) {
        notice({
          title: 'いいねが取り消されました。',
          placement: 'bottom',
          status: 'success',
          isClosable: true,
        });
        setIsLiked(false);
        setLikeTotal((prev) => prev - 1);
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };
  const handleRepostClick = async () => {
    try {
      const response = await fetch(`/api/posts/${post_id}/repost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          userId: userData?.userId,
        }),
      });
      if (response.ok) {
        notice({
          title: '投稿をリポストしました。',
          placement: 'bottom',
          status: 'success',
          isClosable: true,
        });
        setIsReposted(true);
        setRepostTotal((prev) => prev + 1);
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };
  const handleUnRepostClick = async () => {
    try {
      const response = await fetch(`/api/posts/${post_id}/repost`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          userId: userData?.userId,
        }),
      });
      if (response.ok) {
        notice({
          title: 'リポストが取り消されました。',
          placement: 'bottom',
          status: 'success',
          isClosable: true,
        });
        setIsReposted(false);
        setRepostTotal((prev) => prev - 1);
      }
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ListItem as={Card} flexDir='row'>
      <Box pt='md' pl='md'>
        <Avatar />
      </Box>
      <VStack gap={0}>
        <CardHeader pl='sm'>
          <Text fontSize='xl'>{display_name}</Text>
          <Text fontSize='md' color='gray.500'>
            {user_name}
          </Text>
          <Text fontSize='sm' color='gray.500'>
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
            color={['blackAlpha.500', 'whiteAlpha.500']}
          >
            {reply_count}
          </Button>
          <Button
            variant='ghost'
            size='xs'
            gap={1}
            leftIcon={<Repeat2 size='16px' />}
            color={[
              isReposted ? 'green' : 'blackAlpha.500',
              isReposted ? 'green' : 'whiteAlpha.500',
            ]}
            onClick={!isReposted ? handleRepostClick : handleUnRepostClick}
          >
            {repostTotal}
          </Button>
          <Button
            variant='ghost'
            size='xs'
            gap={1}
            color={[
              isLiked ? 'red' : 'blackAlpha.500',
              isLiked ? 'red' : 'whiteAlpha.500',
            ]}
            leftIcon={<Heart size='16px' />}
            onClick={!isLiked ? handleLikeClick : handleUnLikeClick}
          >
            {likeTotal}
          </Button>
        </CardFooter>
      </VStack>
    </ListItem>
  );
};
