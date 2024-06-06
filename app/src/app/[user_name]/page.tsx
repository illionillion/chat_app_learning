import { Profile } from '@/features/profile';
import { Layout } from '@/lib/components/layout/Layout';
import { AppProvider } from '@/lib/components/state/authContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロフィール',
  description: 'プロフィール',
};

const Page = ({ params }: { params: { user_name: string } }) => {
  return (
    <AppProvider>
      <Layout>
        <Profile userName={params.user_name} />
      </Layout>
    </AppProvider>
  );
};

export default Page;
