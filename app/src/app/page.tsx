import { Home } from '@/features/home/components';
import { Layout } from '@/lib/components/layout/Layout';
import { AppProvider } from '@/lib/components/state/authContext';

export default function Page() {
  return (
    <AppProvider>
      <Layout>
        <Home />
      </Layout>
    </AppProvider>
  );
}
