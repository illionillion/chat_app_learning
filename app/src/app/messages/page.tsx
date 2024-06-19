import { Layout } from '@/lib/components/layout/Layout';
import { AppProvider } from '@/lib/components/state/authContext';
import type { Metadata } from 'next';
import { Messages } from '@/features/messages';

export const metadata: Metadata = {
  title: 'メッセージ',
  description: 'メッセージ',
};

const Page = () => {
  return (
    <AppProvider>
      <Layout>
        <Messages />
      </Layout>
    </AppProvider>
  );
};

export default Page;
