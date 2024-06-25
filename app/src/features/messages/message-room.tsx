'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Box,
  Button,
  HStack,
  List,
  Textarea,
  VStack,
  useAsync,
} from '@yamada-ui/react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useContext } from 'react';

interface MessageRoomProps {
  roomId: string;
}

export const MessageRoom: FC<MessageRoomProps> = ({ roomId }) => {
  const { userData } = useContext(StateContext);
  const router = useRouter();
  const { value } = useAsync(async () => {
    const responseMessage = await fetch(
      `/api/rooms/${roomId}/messages?userId=${userData?.userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
      },
    );

    if (responseMessage.status === 500) {
      router.push('/messages');
    }

    const result = (await responseMessage.json()) as {
      messages: {
        messageId: number;
        roomId: number;
        senderId: number;
        content: string;
        sentAt: string;
      }[];
      partner: {
        partnerId: number;
        partnerUsername: string;
        partnerDisplayName: string;
      };
    };

    console.log(result);

    return result;
  });
  return (
    <VStack h='full'>
      <Box
        px={1}
        py={2}
        borderBottom='1px solid black'
        borderBottomColor={['blackAlpha.500', 'whiteAlpha.500']}
        position='sticky'
        top={0}
        bg={['white', 'black']}
        zIndex={999}
      >
        {value?.partner.partnerDisplayName}
      </Box>
      <List px={2} flexGrow={1}></List>
      <HStack
        w='full'
        px={1}
        py={2}
        borderTop='1px solid black'
        borderTopColor={['blackAlpha.500', 'whiteAlpha.500']}
        position='sticky'
        bottom={0}
        bg={['white', 'black']}
        zIndex={999}
      >
        <form style={{ width: '100%' }}>
          <HStack w='full'>
            <Textarea autosize placeholder='メッセージ入力' flexGrow={1} />
            <Button type='submit' colorScheme='sky'>
              送信
            </Button>
          </HStack>
        </form>
      </HStack>
    </VStack>
  );
};
