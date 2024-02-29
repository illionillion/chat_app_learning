'use client';
import { StateContext } from '@/lib/components/state/authContext';
import type { PostData } from '@/lib/types/PostData';
import {
  Box,
  Button,
  List,
  Textarea,
  VStack,
  useNotice,
} from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext, useLayoutEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { PostItem } from './components/PostItem';

type SubmitData = {
  content: string;
};

export const Home: FC = () => {
  const { userData } = useContext(StateContext);
  const notice = useNotice();
  const [posts, setPosts] = useState<PostData[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<SubmitData>();
  const content = watch('content');

  const onSubmit: SubmitHandler<SubmitData> = async (data) => {
    if (!data.content) return;
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          userId: userData?.userId,
          content: data.content,
        }),
      });
      console.log(response);
      const json = await response.json();
      console.log(json);
      if (response.ok) {
        notice({
          title: '正常に投稿が作成されました。',
          placement: 'bottom',
          status: 'success',
          isClosable: true,
        });
        reset();
        fetchPosts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const { posts } = (await response.json()) as { posts: PostData[] };
      console.log(posts);
      setPosts(posts);
    } catch (error) {
      console.error('fetch error:', error);
    }
  };

  useLayoutEffect(() => {
    fetchPosts();
  }, []);

  return (
    <VStack>
      <Box
        px={1}
        py={2}
        borderBottom='1px solid black'
        position='sticky'
        top={0}
        bg='white'
        zIndex={99999}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Textarea
              autosize
              placeholder='なにしてる？'
              {...register('content')}
              isDisabled={isSubmitting}
            />
            <Box textAlign='right'>
              <Button
                type='submit'
                colorScheme='sky'
                isDisabled={!content || /^\s*$/.test(content)}
                isLoading={isSubmitting}
              >
                投稿
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
      <List px={2}>
        {posts &&
          posts.length > 0 &&
          posts.map((v, i) => <PostItem key={`${v.post_id}-${i}`} {...v} />)}
      </List>
    </VStack>
  );
};
