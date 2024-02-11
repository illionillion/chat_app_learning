'use client';
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useBoolean,
  useNotice,
} from '@yamada-ui/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FC } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type LoginData = {
  userName: string;
  password: string;
};

export const LoginForm: FC = () => {
  const [show, { toggle }] = useBoolean();

  const notice = useNotice();

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      console.log(response);
      console.log(json);

      if (response.status === 200) {
        /* 
            ログイン成功
            userIdとtokenをCookieかストレージに保存、カスタムフックで保持
        */
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
        <Button type='submit'>ログイン</Button>
      </VStack>
    </form>
  );
};
