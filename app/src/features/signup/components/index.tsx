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
  Link,
  VStack,
  useBoolean,
  useNotice,
} from '@yamada-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useContext, useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type SignupData = {
  userName: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignupForm: FC = () => {
  const [passwordShow, { toggle: passwordShowToggle }] = useBoolean();
  const [confirmPasswordShow, { toggle: confirmPasswordToggle }] = useBoolean();

  const { onLogin, userData } = useContext(StateContext);

  const notice = useNotice();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SignupData>();

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    console.log('submit:', data);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      const token = response.headers.get('Authorization');

      if (response.ok && token) {
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
      console.error('登録エラー', error);
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
          label='表示名'
          isInvalid={!!errors.displayName}
          errorMessage={errors.displayName?.message}
        >
          <Input
            type='text'
            placeholder='表示名を入力'
            {...register('displayName', {
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
          label='メールアドレス'
          isInvalid={!!errors.email}
          errorMessage={errors.email?.message}
        >
          <Input
            type='email'
            placeholder='メールアドレスを入力'
            {...register('email', {
              required: {
                value: true,
                message: '必須項目です。',
              },
              onBlur: () => {
                if (getValues('email')) {
                  trigger('email');
                }
              },
              pattern: {
                value: /^[\w\-._]+@[\w\-._]+\.[A-Za-z]+/,
                message: '入力形式がメールアドレスではありません。',
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
              type={passwordShow ? 'text' : 'password'}
              placeholder='パスワードを入力'
              {...register('password', {
                required: {
                  value: true,
                  message: '必須項目です。',
                },
                minLength: {
                  value: 8,
                  message: 'パスワードは8文字以上にしてください。',
                },
              })}
              autoComplete='on'
            />
            <InputRightElement isClick>
              <IconButton
                size='sm'
                icon={passwordShow ? <EyeOff /> : <Eye />}
                onClick={passwordShowToggle}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl
          isRequired
          label='パスワード（確認用）'
          isInvalid={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword?.message}
        >
          <InputGroup>
            <Input
              type={confirmPasswordShow ? 'text' : 'password'}
              placeholder='パスワード（確認用）を入力'
              {...register('confirmPassword', {
                required: {
                  value: true,
                  message: '必須項目です。',
                },
                validate: (value) =>
                  value === watch('password') || 'パスワードと一致しません。',
              })}
              autoComplete='on'
            />
            <InputRightElement isClick>
              <IconButton
                size='sm'
                icon={confirmPasswordShow ? <EyeOff /> : <Eye />}
                onClick={confirmPasswordToggle}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button type='submit' isLoading={isSubmitting}>
          新規登録
        </Button>
        <Box textAlign='center'>
          <Link href='/login'>ログイン</Link>
        </Box>
      </VStack>
    </form>
  );
};
