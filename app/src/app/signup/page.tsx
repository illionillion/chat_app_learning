import { AppProvider } from '@/lib/components/state/authContext';
import type { Metadata, NextPage } from 'next';
import { Container, Heading } from '@yamada-ui/react';
import { SignupForm } from '@/features/signup/components';
export const metadata: Metadata = {
  title: 'サインアップ',
  description: '新規登録',
};

const SignupPage: NextPage = () => {
  return (
    <AppProvider>
      <Container maxW='2xl' justifyContent='center' m='auto'>
        <Heading textAlign='center'>新規登録</Heading>
        <SignupForm />
      </Container>
    </AppProvider>
  );
};

export default SignupPage;
