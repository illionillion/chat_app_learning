'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Link as UILink,
  VStack,
  useBoolean,
  useNotice,
} from '@yamada-ui/react';
import { Eye, EyeOff } from '@yamada-ui/lucide';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, type FC, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type LoginData = {
  userName: string;
  password: string;
};

export const LoginForm: FC = () => {
  const [show, { toggle }] = useBoolean();

  const { onLogin, userData } = useContext(StateContext);

  const notice = useNotice();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>();

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    console.log('submit:', data);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      const token = response.headers.get('Authorization');

      if (response.status === 200 && token) {
        /* 
            ログイン成功
            userIdとtokenをCookieかストレージに保存、カスタムフックで保持
        */
        onLogin({
          userId: json?.userId,
          userName: json?.userName,
          token: token.replace('Bearer ', '').trim(),
        });
      } else {
        notice({
          title: 'エラー',
          description: json.message,
          placement: 'top-right',
          status: 'error',
          variant: 'top-accent',
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('ログインエラー', error);
      notice({
        title: 'エラー',
        description: (error as any).message,
        placement: 'top-right',
        status: 'error',
        variant: 'top-accent',
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (userData && Object.values(userData).every((v) => !!v === true)) {
      router.push('/');
    }
  }, [userData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap='lg'>
        <FormControl
          isRequired
          label='ユーザーID'
          isInvalid={!!errors.userName}
          errorMessage={errors.userName?.message}
        >
          <Input
            type='text'
            placeholder='ユーザー名を入力'
            {...register('userName', {
              required: {
                value: true,
                message: '必須項目です。',
              },
            })}
            autoComplete='on'
          />
        </FormControl>
        <FormControl
          isRequired
          label='パスワード'
          isInvalid={!!errors.password}
          errorMessage={errors.password?.message}
        >
          <InputGroup>
            <Input
              type={show ? 'text' : 'password'}
              placeholder='パスワードを入力'
              {...register('password', {
                required: {
                  value: true,
                  message: '必須項目です。',
                },
              })}
              autoComplete='on'
            />
            <InputRightElement isClick>
              <IconButton
                size='sm'
                icon={show ? <EyeOff /> : <Eye />}
                onClick={toggle}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button type='submit' isLoading={isSubmitting}>
          ログイン
        </Button>
        <Box textAlign='center'>
          <UILink href='/signup' as={Link}>
            新規登録
          </UILink>
        </Box>
      </VStack>
    </form>
  );
};
