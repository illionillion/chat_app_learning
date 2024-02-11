'use client';
import { StateContext } from '@/lib/state/authContext';
import type { FC } from 'react';
import { useContext } from 'react';

export const Home: FC = () => {
  const { userData } = useContext(StateContext);
  console.log(userData);

  return <>Top</>;
};
