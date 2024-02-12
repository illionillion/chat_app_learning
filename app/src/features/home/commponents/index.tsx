'use client';
import { StateContext } from '@/lib/state/authContext';
import { Box, Button, Text } from '@yamada-ui/react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useContext, useEffect } from 'react';

export const Home: FC = () => {
  const { userData, onLogout } = useContext(StateContext);
  const router = useRouter();

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
        router.push('/');
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
    <Box>
      <Text>Top</Text>
      <Button onClick={onLogout}>Logout</Button>
    </Box>
  );
};
