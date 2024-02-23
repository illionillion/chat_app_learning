import { Home } from '@/features/home/UI';
import { Layout } from '@/lib/components/layout/Layout';
import { AppProvider } from '@/lib/components/state/authContext';
import type { NextPage } from 'next';

const Page: NextPage = () => {
  return (
    <AppProvider>
      <Layout>
        <Home />
      </Layout>
    </AppProvider>
  );
};

export default Page;
