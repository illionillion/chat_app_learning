import { MessageRoom } from '@/features/messages/message-room';
import { Layout } from '@/lib/components/layout/Layout';
import { AppProvider } from '@/lib/components/state/authContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'メッセージ',
  description: 'メッセージ',
};

const Page = ({ params }: { params: { room_id: string } }) => {
  return (
    <AppProvider>
      <Layout>
        <MessageRoom roomId={params.room_id} />
      </Layout>
    </AppProvider>
  );
};

export default Page;
