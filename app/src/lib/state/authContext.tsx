'use client';
import type { ReactNode } from 'react';
import { createContext, useState } from 'react';

export interface UserData {
  userId: number | undefined;
  userName: string | undefined;
  token: string | undefined;
}

export interface StateContextType {
  userData: UserData | undefined;
  onLogin: (user: UserData) => void;
  onLogout: () => void;
}
const defaultContext: StateContextType = {
  userData: undefined,
  onLogin: () => {},
  onLogout: () => {},
};

export const StateContext = createContext<StateContextType>(defaultContext);

export const useStateContext = () => {
  // const [value, setValue, resetValue] = useLocalStorage<UserData>({
  //   key: "chat_app_user_data",
  //   defaultValue: {
  //     userId: undefined,
  //     userName: undefined,
  //     token: undefined
  //   }
  // });
  const [value, setValue] = useState<UserData>(getLocalStorage());

  const onLogin: StateContextType['onLogin'] = (user) => {
    setValue(user);
    setLocalStorage(user);
  };
  const onLogout: StateContextType['onLogout'] = () => {
    setValue({
      userId: undefined,
      token: undefined,
      userName: undefined,
    });
  };
  const contextValue: StateContextType = {
    userData: value,
    onLogin,
    onLogout,
  };
  return contextValue;
};

const getLocalStorage = (): UserData => {
  try {
    return JSON.parse(localStorage.getItem('chat_app_user_data') || '');
  } catch (error) {
    console.error(error);
    return {
      userId: undefined,
      token: undefined,
      userName: undefined,
    };
  }
};

const setLocalStorage = (user: UserData) => {
  try {
    localStorage.setItem('chat_app_user_data', JSON.stringify(user));
  } catch (error) {
    console.error(error);
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useStateContext();

  return <StateContext.Provider value={ctx}>{children}</StateContext.Provider>;
};
