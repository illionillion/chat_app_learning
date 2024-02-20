'use client';
import { Box, Button, HStack, List, ListItem } from '@yamada-ui/react';
import { Bell, Home, LogOut, Mail, Search, UserRound } from 'lucide-react';
import { useContext, type FC, type ReactNode } from 'react';
import { StateContext } from '../state/authContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { onLogout } = useContext(StateContext);

  return (
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
      <Box w='full' h='full'>
        {children}
      </Box>
    </HStack>
  );
};
