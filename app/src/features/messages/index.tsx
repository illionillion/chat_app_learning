'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Autocomplete,
  AutocompleteOption,
  Box,
  Center,
  List,
  Text,
  VStack,
  useAsync,
  useNotice,
} from '@yamada-ui/react';
import { useContext, type FC } from 'react';

export const Messages: FC = () => {
  const { userData } = useContext(StateContext);
  const notice = useNotice();
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

    const data = users
      .filter((user) => user.userId !== userData?.userId)
      .map((user) => ({
        label: `${user.userName} ${user.displayName}`,
        value: user.userId.toString(),
      }));
    return data;
  });

  const handleCreateRoom = async (id: string) => {
    if (!id) return;
    const response = await fetch('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({
        userId: userData?.userId,
        users: [userData?.userId, id],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData?.token}`,
      },
    });

    const result = await response.json();

    console.log(result);

    switch (response.status) {
      case 409:
        // ルームへ移動
        break;
      case 500:
        notice({
          title: 'エラー',
          description: result.message,
          placement: 'bottom-right',
          status: 'error',
          variant: 'top-accent',
          isClosable: true,
        });
        break;

      default:
        // ルームへ移動
        break;
    }
  };

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
        <Autocomplete placeholder='ユーザーを選択' onChange={handleCreateRoom}>
          {users?.map((user, index) => (
            <AutocompleteOption key={index} value={user.value}>
              {user.label}
            </AutocompleteOption>
          ))}
        </Autocomplete>
      </Box>
      <List px={2}>
        <Center>
          <Text>メッセージがありません</Text>
        </Center>
      </List>
    </VStack>
  );
};
