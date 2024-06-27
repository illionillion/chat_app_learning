'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Autocomplete,
  AutocompleteOption,
  Avatar,
  Box,
  Center,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
  useAsync,
  useNotice,
} from '@yamada-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, type FC } from 'react';

export const Messages: FC = () => {
  const { userData } = useContext(StateContext);
  const router = useRouter();
  const notice = useNotice();
  const { value } = useAsync(async () => {
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

    const responseRooms = await fetch(`/api/rooms?userId=${userData?.userId}`, {
      cache: 'no-cache',
      headers: {
        Authorization: `Bearer ${userData?.token}`,
      },
    });

    const { rooms } = (await responseRooms.json()) as {
      rooms: {
        roomId: number;
        partnerId: number;
        partnerUsername: string;
        partnerDisplayName: string;
      }[];
    };
    console.log(rooms);

    const data = {
      users: users
        .filter((user) => user.userId !== userData?.userId)
        .map((user) => ({
          label: `${user.userName} ${user.displayName}`,
          value: user.userId.toString(),
        })),
      rooms,
    };

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
      cache: 'no-cache',
    });

    const result = await response.json();

    console.log(result);

    switch (response.status) {
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
        if (result.roomId) router.push(`/messages/${result.roomId}`);
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
          {value?.users?.map((user, index) => (
            <AutocompleteOption key={index} value={user.value}>
              {user.label}
            </AutocompleteOption>
          ))}
        </Autocomplete>
      </Box>
      <List px={2}>
        {value?.rooms.length === 0 ? (
          <Center>
            <Text>メッセージがありません</Text>
          </Center>
        ) : (
          value?.rooms.map((room, index) => (
            <ListItem key={index} display='flex' gap='md'>
              <Avatar as={Link} href={`/${room.partnerUsername}`} />
              <Center as={Link} href={`/messages/${room.roomId}`}>
                <HStack>
                  <Text>{room.partnerDisplayName}</Text>
                  <Text color='gray.500'>{room.partnerUsername}</Text>
                </HStack>
              </Center>
            </ListItem>
          ))
        )}
      </List>
    </VStack>
  );
};
