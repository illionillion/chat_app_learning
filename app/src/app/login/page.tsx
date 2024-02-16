import { LoginForm } from '@/features/login/components';
import { AppProvider } from '@/lib/components/state/authContext';
import { Container, Heading } from '@yamada-ui/react';
import type { NextPage } from 'next';

export const metadata = {
  title: 'ログイン',
};

const LoginPage: NextPage = () => {
  return (
    <AppProvider>
      <Container maxW='2xl' justifyContent='center' m='auto' h='100dvh'>
        <Heading textAlign='center'>ログイン</Heading>
        <LoginForm />
      </Container>
    </AppProvider>
  );
};

export default LoginPage;
