'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Heading,
  List,
  SkeletonText,
  Text,
  VStack,
  useAsync,
} from '@yamada-ui/react';
import { useContext, type FC } from 'react';
import { PostItem } from '../home/UI/components/PostItem';
import type { PostData } from '@/lib/types/PostData';
import type { UserData } from '@/lib/types/UserData';

export const Profile: FC<{ userName: string }> = ({ userName }) => {
  const { userData } = useContext(StateContext);
  const { value, loading } = useAsync(async () => {
    const requestUser = await fetch(`/api/users/${userName}/profile`);
    const user = (await requestUser.json()) as UserData;
    const requestPosts = await fetch(`/api/users/${userName}/posts`);
    const { posts } = (await requestPosts.json()) as { posts: PostData[] };
    return { ...user, posts };
  });

  return (
    <VStack>
      <HStack
        p='md'
        borderBottom='1px solid'
        borderBottomColor={['blackAlpha.500', 'whiteAlpha.500']}
      >
        <Center flex={1}>
          <SkeletonText isLoaded={!loading} fadeDuration={2}>
            <>
              <Center gap='md'>
                <Heading>{value?.displayName}</Heading>
                <Text color={['blackAlpha.500', 'whiteAlpha.500']}>
                  @{userName}
                </Text>
              </Center>
              <Text>{value?.description}</Text>
            </>
          </SkeletonText>
        </Center>
        <HStack as={Center} flex={1} alignItems='center'>
          <Avatar alt={userName} size='xl' />
          {userData?.userName === userName && (
            <Box>
              <Button>編集</Button>
            </Box>
          )}
        </HStack>
      </HStack>
      <List px={2}>
        {value?.posts && value?.posts.length > 0 ? (
          value?.posts.map((v, i: number) => (
            <PostItem key={`${v.post_id}-${i}`} {...v} />
          ))
        ) : (
          <Center>
            <Text>投稿がありません</Text>
          </Center>
        )}
      </List>
    </VStack>
  );
};
