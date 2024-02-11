import { Home } from '@/features/home/commponents';
import { AppProvider } from '@/lib/state/authContext';

export default function Page() {
  return (
    <AppProvider>
      <Home />
    </AppProvider>
  );
}
