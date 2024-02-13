'use client';
import { Box, HStack, Heading, Link } from '@yamada-ui/react';
import type { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <HStack
        as='header'
        position='sticky'
        top={0}
        w='100vw'
        px={2}
        py={3}
        justify='space-between'
      >
        <Box>
          <Heading size='md'>SNS</Heading>
        </Box>
        <HStack as='nav' gap={4} alignItems='center'>
          <Link href='/'>TOP</Link>
          <Link href='/'>TOP</Link>
          <Link href='/'>TOP</Link>
        </HStack>
      </HStack>
      <Box as='main'>{children}</Box>
    </>
  );
};
