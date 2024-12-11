import { createContext, ReactNode, useState } from "react";
import type { UserStatusContextProps } from "../types/user-status-context";

export const UserStatusContext = createContext<UserStatusContextProps | null>(null);

export function UserStatusContextProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
  };

  return (
    <UserStatusContext.Provider value={{ isLoggedIn, updateIsLoggedIn }}>
      {children}
    </UserStatusContext.Provider>
  );
}
