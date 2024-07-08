'use client';
import {
  Box,
  Button,
  Center,
  HStack,
  List,
  ListItem,
  Loading,
  useColorMode,
} from '@yamada-ui/react';
import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserRoundIcon,
} from '@yamada-ui/lucide';
import {
  useContext,
  type FC,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { StateContext } from '../state/authContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
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

  return isChecked ? (
    <HStack w='100vw' h='100dvh' gap={0}>
      <List
        w='xs'
        h='full'
        justifyContent='center'
        px={2}
        borderRight='1px solid black'
        borderRightColor={['blackAlpha.500', 'whiteAlpha.500']}
      >
        <ListItem>
          <Button
            w='full'
            justifyContent='left'
            as={Link}
            variant='ghost'
            href='/'
            leftIcon={<HomeIcon />}
          >
            ホーム
          </Button>
        </ListItem>
        <ListItem>
          <Button
            isDisabled
            w='full'
            justifyContent='left'
            as={Link}
            variant='ghost'
            href='/'
            leftIcon={<SearchIcon />}
          >
            検索
          </Button>
        </ListItem>
        <ListItem>
          <Button
            isDisabled
            w='full'
            justifyContent='left'
            as={Link}
            variant='ghost'
            href='/'
            leftIcon={<BellIcon />}
          >
            通知
          </Button>
        </ListItem>
        <ListItem>
          <Button
            w='full'
            justifyContent='left'
            as={Link}
            variant='ghost'
            href='/messages'
            leftIcon={<MailIcon />}
          >
            DM
          </Button>
        </ListItem>
        <ListItem>
          <Button
            w='full'
            justifyContent='left'
            as={Link}
            variant='ghost'
            href={`/${userData?.userName}`}
            leftIcon={<UserRoundIcon />}
          >
            プロフィール
          </Button>
        </ListItem>
        <ListItem>
          <Button
            justifyContent='left'
            variant='ghost'
            leftIcon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
          >
            {colorMode === 'light' ? 'ライト' : 'ダーク'}モード
          </Button>
        </ListItem>
        <ListItem>
          <Button
            w='full'
            justifyContent='left'
            variant='ghost'
            leftIcon={<LogOutIcon />}
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
  ) : (
    <Center w='100vw' h='100dvh'>
      <Loading size='4xl' />
    </Center>
  );
};
