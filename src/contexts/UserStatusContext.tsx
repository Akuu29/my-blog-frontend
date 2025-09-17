import { createContext, ReactNode, useState, useEffect } from "react";

import TokenApi from "../services/token-api";
import { extractUserIdFromAccessToken } from "../utils/jwt";
import type { UserStatusContextProps } from "../types/user-status-context";

export const UserStatusContext = createContext<UserStatusContextProps | null>(null);

export function UserStatusContextProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const updateIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
  };

  const updateCurrentUserId = (id: string | null) => {
    setCurrentUserId(id);
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
        setCurrentUserId(extractUserIdFromAccessToken(accessToken));
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(null);
      }
    };

    initializeIsLoggedIn();
  }, []);

  return (
    <UserStatusContext.Provider value={{ isLoggedIn, currentUserId, updateIsLoggedIn, updateCurrentUserId }}>
      {children}
    </UserStatusContext.Provider>
  );
}
