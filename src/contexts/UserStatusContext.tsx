import { createContext, ReactNode, useState, useEffect } from "react";

import type { UserStatusContextProps } from "../types/user-status-context";
import TokenApi from "../services/token-api";

export const UserStatusContext = createContext<UserStatusContextProps | null>(null);

export function UserStatusContextProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
  };

  useEffect(() => {
    const initializeIsLoggedIn = async () => {
      const result = await TokenApi.refreshToken();

      if (result.isOk()) {
        const accessToken = result.unwrap().accessToken;

        navigator.serviceWorker.controller?.postMessage({
          type: "SET_ACCESS_TOKEN",
          message: accessToken,
        });

        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };

    initializeIsLoggedIn();
  }, []);

  return (
    <UserStatusContext.Provider value={{ isLoggedIn, updateIsLoggedIn }}>
      {children}
    </UserStatusContext.Provider>
  );
}
