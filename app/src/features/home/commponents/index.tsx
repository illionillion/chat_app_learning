'use client';
import { StateContext } from '@/lib/state/authContext';
import { Box, Button, Text } from '@yamada-ui/react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useContext, useEffect } from 'react';

export const Home: FC = () => {
  const { userData, onLogout } = useContext(StateContext);
  const router = useRouter();

  useEffect(() => {
    console.log(userData);
    if (userData && Object.values(userData).every((v) => !!v === true)) {
      console.log('ログイン済み');
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
