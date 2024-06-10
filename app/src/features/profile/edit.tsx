'use client';
import { StateContext } from '@/lib/components/state/authContext';
import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  Textarea,
  VStack,
  useAsync,
} from '@yamada-ui/react';
import { useContext } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

type ProfileData = {
  displayName: string;
  description: string;
};

export const EditProfile = () => {
  const { userData } = useContext(StateContext);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileData>();

  const { loading } = useAsync(async () => {
    const response = await fetch(`/api/users/${userData?.userName}/profile`, {
      cache: 'no-cache',
    });
    const user = await response.json();
    setValue('displayName', user!.displayName);
    setValue('description', user!.description);
  });

  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    console.log(data);
  };

  return (
    <Center w='full' h='full' gap='lg' flexDir='column'>
      <Heading>プロフィールを変更</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap='lg'>
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
              isDisabled={loading}
              autoComplete='on'
            />
          </FormControl>
          <FormControl label='説明'>
            <Textarea placeholder='説明を入力' isDisabled={loading} />
          </FormControl>
          <Button type='submit' isLoading={isSubmitting || loading}>
            変更
          </Button>
        </VStack>
      </form>
    </Center>
  );
};
