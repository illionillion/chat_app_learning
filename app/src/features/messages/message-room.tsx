'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Button,
  Center,
  HStack,
  List,
  Text,
  Textarea,
  VStack,
  useAsync,
  useNotice,
} from '@yamada-ui/react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useContext, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { MessageItem } from './components/message-item';

interface MessageRoomProps {
  roomId: string;
}

type SubmitData = {
  content: string;
};

export const MessageRoom: FC<MessageRoomProps> = ({ roomId }) => {
  const { userData } = useContext(StateContext);
  const [messages, setMessages] = useState<
    {
      messageId: number;
      roomId: number;
      senderId: number;
      content: string;
      sentAt: string;
    }[]
  >([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<SubmitData>();
  const content = watch('content');
  const notice = useNotice();
  const onSubmit: SubmitHandler<SubmitData> = async (data) => {
    if (!data.content) return;
    try {
      const response = await fetch(`/api/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        body: JSON.stringify({
          senderId: userData?.userId,
          receiverId: value?.partner.partnerId,
          content: data.content,
        }),
      });
      console.log(response);
      const json = await response.json();
      console.log(json);
      if (response.ok) {
        notice({
          title: 'メッセージを送信しました。',
          placement: 'top',
          status: 'success',
          isClosable: true,
        });
        await fetchMessages();
        reset();
      }
    } catch (error) {
      console.error(error);
      notice({
        title: 'メッセージを送信できませんでした。',
        placement: 'top',
        status: 'success',
        isClosable: true,
      });
    }
  };

  const fetchMessages = async () => {
    const responseMessage = await fetch(
      `/api/rooms/${roomId}/messages?userId=${userData?.userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData?.token}`,
        },
        cache: 'no-cache',
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

    setMessages(result.messages);

    return result;
  };

  const { value, loading } = useAsync(async () => {
    return await fetchMessages();
  });
  return (
    <VStack h='full'>
      <HStack
        px={1}
        py={2}
        borderBottom='1px solid black'
        borderBottomColor={['blackAlpha.500', 'whiteAlpha.500']}
        position='sticky'
        top={0}
        bg={['white', 'black']}
        zIndex={99}
      >
        <Text>{value?.partner.partnerDisplayName}</Text>
        <Text fontSize='sm' color='gray.500'>
          {value?.partner.partnerUsername}
        </Text>
      </HStack>
      <List px={2} flexGrow={1}>
        {messages.length === 0 ? (
          <Center>
            <Text>メッセージがありません</Text>
          </Center>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.messageId} message={message} />
          ))
        )}
      </List>
      <HStack
        w='full'
        px={1}
        py={2}
        borderTop='1px solid black'
        borderTopColor={['blackAlpha.500', 'whiteAlpha.500']}
        position='sticky'
        bottom={0}
        bg={['white', 'black']}
        zIndex={99}
      >
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <HStack w='full'>
            <Textarea
              autosize
              placeholder='メッセージ入力'
              flexGrow={1}
              {...register('content')}
              isDisabled={isSubmitting || loading}
            />
            <Button
              type='submit'
              colorScheme='sky'
              isDisabled={!content || /^\s*$/.test(content)}
              isLoading={isSubmitting}
            >
              送信
            </Button>
          </HStack>
        </form>
      </HStack>
    </VStack>
  );
};
