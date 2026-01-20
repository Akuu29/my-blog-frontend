import { createContext, ReactNode, useState, useEffect } from "react";

import TokenApi from "../services/token-api";
import type { UserStatusContextProps } from "../types/user-status-context";

export const UserStatusContext = createContext<UserStatusContextProps | null>(null);

export function UserStatusContextProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  const updateIsLoggedIn = (value: boolean) => {
    setIsLoggedIn(value);
  };

  const updateCurrentUserId = (id: string | null) => {
    setCurrentUserId(id);
  };

  const updateCurrentUserName = (name: string | null) => {
    setCurrentUserName(name);
  };

  useEffect(() => {
    const initializeIsLoggedIn = async () => {
      try {
        const result = await TokenApi.refreshToken();

        if (result.isOk()) {
          const credentials = result.unwrap();
          const accessToken = credentials.accessToken;

          navigator.serviceWorker.controller?.postMessage({
            type: "SET_ACCESS_TOKEN",
            message: accessToken,
          });

          setIsLoggedIn(true);
          setCurrentUserId(credentials.user.id);
          setCurrentUserName(credentials.user.name);
        } else {
          setIsLoggedIn(false);
          setCurrentUserId(null);
          setCurrentUserName(null);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    initializeIsLoggedIn();
  }, []);

  return (
    <UserStatusContext.Provider value={{ isLoggedIn, isInitializing, currentUserId, currentUserName, updateIsLoggedIn, updateCurrentUserId, updateCurrentUserName }}>
      {children}
    </UserStatusContext.Provider>
  );
}
