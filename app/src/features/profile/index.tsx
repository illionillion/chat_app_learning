'use client';
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Heading,
  SkeletonText,
  Text,
  VStack,
  useAsync,
} from '@yamada-ui/react';
import type { FC } from 'react';

export const Profile: FC<{ userName: string }> = ({ userName }) => {
  const { value, loading } = useAsync(async () => {
    const request = await fetch(`/api/users/${userName}/profile`);
    const response = await request.json();
    console.log(response);
    return response;
  });

  console.log(value);

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
          <Box>
            <Button>編集</Button>
          </Box>
        </HStack>
      </HStack>
    </VStack>
  );
};
