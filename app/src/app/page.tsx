import { Home } from '@/features/home/commponents';
import { Layout } from '@/lib/commponents/layout/Layout';
import { AppProvider } from '@/lib/commponents/state/authContext';

export default function Page() {
  return (
    <AppProvider>
      <Layout>
        <Home />
      </Layout>
    </AppProvider>
  );
}
