'use client';
import { StateContext } from '@/lib/components/state/authContext';
import { Box, Button, Textarea, VStack, useNotice } from '@yamada-ui/react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useContext, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type SubmitData = {
  content: string;
};

export const Home: FC = () => {
  const { userData, onLogout } = useContext(StateContext);
  const router = useRouter();
  const notice = useNotice();

  const { register, handleSubmit, reset, watch } = useForm<SubmitData>();
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
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkToken = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        body: JSON.stringify({
          userId: userData?.userId,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
      });

      const json = await response.json();

      // 正しくないならログアウト
      if (!json.authenticated) {
        onLogout();
        return;
      }
    } catch (error) {
      console.error('verify', error);
    }
  };

  useEffect(() => {
    console.log(userData);
    if (userData && Object.values(userData).every((v) => !!v === true)) {
      console.log('ログイン済み');
      // 認証
      checkToken();
    } else {
      console.log('未ログイン');
      router.push('/login');
    }
  }, [userData]);

  return (
    <VStack>
      <Box px={1} py={2} borderBottom='1px solid black'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <Textarea
              autosize
              placeholder='なにしてる？'
              {...register('content')}
            />
            <Box textAlign='right'>
              <Button
                type='submit'
                colorScheme='sky'
                isDisabled={!content || /^\s*$/.test(content)}
              >
                投稿
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </VStack>
  );
};
