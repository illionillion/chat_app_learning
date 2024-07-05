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
import Link from 'next/link';

export const Profile: FC<{ userName: string }> = ({ userName }) => {
  const { userData } = useContext(StateContext);
  const { value, loading } = useAsync(async () => {
    const responseUser = await fetch(`/api/users/${userName}/profile`);
    const user = (await responseUser.json()) as UserData;
    const responsePosts = await fetch(`/api/users/${userName}/posts`);
    const { posts } = (await responsePosts.json()) as { posts: PostData[] };
    return { ...user, posts };
  });

  return (
    <VStack>
      <Center
        p='md'
        borderBottom='1px solid'
        borderBottomColor={['blackAlpha.500', 'whiteAlpha.500']}
      >
        <VStack maxW='7xl'>
          <HStack justifyContent='space-between'>
            <Center>
              <SkeletonText isLoaded={!loading} fadeDuration={2}>
                <>
                  <Center gap='md' justifyContent='left'>
                    <Heading>{value?.displayName}</Heading>
                    <Text color={['blackAlpha.500', 'whiteAlpha.500']}>
                      @{userName}
                    </Text>
                  </Center>
                </>
              </SkeletonText>
            </Center>
            <HStack as={Center} alignItems='center'>
              <Avatar alt={userName} size='xl' />
              {userData?.userName === userName && (
                <Box>
                  <Button as={Link} href='/edit-profile'>
                    編集
                  </Button>
                </Box>
              )}
            </HStack>
          </HStack>
          <SkeletonText isLoaded={!loading} fadeDuration={2}>
            <Text>{value?.description}</Text>
          </SkeletonText>
        </VStack>
      </Center>
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
