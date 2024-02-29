'use client';
import { Box, Button, HStack, List, ListItem } from '@yamada-ui/react';
import { Bell, Home, LogOut, Mail, Search, UserRound } from 'lucide-react';
import {
  useContext,
  type FC,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { StateContext } from '../state/authContext';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { onLogout, userData } = useContext(StateContext);
  const [isChecked, setIsChecked] = useState<boolean>(false);
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
        await onLogout();
        return;
      }
      setIsChecked(true);
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
    isChecked && (
      <HStack w='100vw' h='100dvh' gap={0}>
        <List
          w='xs'
          h='full'
          justifyContent='center'
          px={2}
          borderRight='1px solid black'
        >
          <ListItem>
            <Button
              w='full'
              justifyContent='left'
              as='a'
              variant='ghost'
              href='/'
              leftIcon={<Home />}
            >
              ホーム
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='full'
              justifyContent='left'
              as='a'
              variant='ghost'
              href='/'
              leftIcon={<Search />}
            >
              検索
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='full'
              justifyContent='left'
              as='a'
              variant='ghost'
              href='/'
              leftIcon={<Bell />}
            >
              通知
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='full'
              justifyContent='left'
              as='a'
              variant='ghost'
              href='/'
              leftIcon={<Mail />}
            >
              DM
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='full'
              justifyContent='left'
              as='a'
              variant='ghost'
              href='/'
              leftIcon={<UserRound />}
            >
              プロフィール
            </Button>
          </ListItem>
          <ListItem>
            <Button
              w='full'
              justifyContent='left'
              variant='ghost'
              leftIcon={<LogOut />}
              onClick={onLogout}
            >
              ログアウト
            </Button>
          </ListItem>
        </List>
        <Box w='full' h='full' overflowY='auto'>
          {children}
        </Box>
      </HStack>
    )
  );
};
