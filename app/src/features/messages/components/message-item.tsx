import { StateContext } from '@/lib/components/state/authContext';
import { Card, CardBody, ListItem, Text } from '@yamada-ui/react';
import type { FC } from 'react';
import { useContext } from 'react';

export const MessageItem: FC<{
  message: {
    messageId: number;
    roomId: number;
    senderId: number;
    content: string;
    sentAt: string;
  };
}> = ({ message }) => {
  const { userData } = useContext(StateContext);

  const date = new Date(message.sentAt);
  const convertJST = new Date(date);
  convertJST.setHours(convertJST.getHours() - 9);
  const formattedTime = convertJST.toLocaleString('ja-JP').slice(0, -3);
  return (
    <ListItem
      key={message.messageId}
      display='flex'
      justifyContent={message.senderId === userData?.userId ? 'right' : 'left'}
      alignItems='end'
      gap='md'
    >
      {message.senderId === userData?.userId && (
        <Text fontSize='sm' color='gray.500'>
          {formattedTime}
        </Text>
      )}
      <Card
        bgColor={message.senderId === userData?.userId ? 'primary' : 'blue.800'}
      >
        <CardBody>
          <Text as='pre' color='white'>
            {message.content}
          </Text>
        </CardBody>
      </Card>
      {message.senderId !== userData?.userId && (
        <Text fontSize='sm' color='gray.500'>
          {formattedTime}
        </Text>
      )}
    </ListItem>
  );
};
