import { EditProfile } from '@/features/profile/edit';
import { Layout } from '@/lib/components/layout/Layout';
import { AppProvider } from '@/lib/components/state/authContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロフィール - 編集',
  description: 'プロフィール - 編集',
};

const Page = () => {
  return (
    <AppProvider>
      <Layout>
        <EditProfile />
      </Layout>
    </AppProvider>
  );
};

export default Page;
