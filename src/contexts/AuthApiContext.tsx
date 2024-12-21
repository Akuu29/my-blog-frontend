import { createContext, ReactNode } from "react";
import AuthApi from "../services/auth-api";

export const AuthApiContext = createContext<AuthApi | null>(null);

export function AuthApiContextProvider({ children }: { children: ReactNode }) {
  const authApi = new AuthApi();

  return (
    <AuthApiContext.Provider value={authApi}>
      {children}
    </AuthApiContext.Provider>
  );
}
