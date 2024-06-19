'use client';
import {
  Autocomplete,
  AutocompleteOption,
  Box,
  Center,
  List,
  Text,
  VStack,
  useAsync,
} from '@yamada-ui/react';
import type { FC } from 'react';

export const Messages: FC = () => {
  const { value: users } = useAsync(async () => {
    const responseUsers = await fetch('/api/users', {
      cache: 'no-cache',
    });

    const { users } = (await responseUsers.json()) as {
      users: {
        userId: number;
        userName: string;
        displayName: string;
        description: string;
        iconPath: string;
      }[];
    };

    const data = users.map((user) => ({
      label: `${user.userName} ${user.displayName}`,
      value: user.userId.toString(),
    }));
    return data;
  });

  return (
    <VStack>
      <Box
        px={1}
        py={2}
        borderBottom='1px solid black'
        borderBottomColor={['blackAlpha.500', 'whiteAlpha.500']}
        position='sticky'
        top={0}
        bg={['white', 'black']}
        zIndex={99999}
      >
        <form>
          <Autocomplete placeholder='ユーザーを選択'>
            {users?.map((user, index) => (
              <AutocompleteOption key={index} value={user.value}>
                {user.label}
              </AutocompleteOption>
            ))}
          </Autocomplete>
        </form>
      </Box>
      <List px={2}>
        <Center>
          <Text>メッセージがありません</Text>
        </Center>
      </List>
    </VStack>
  );
};
