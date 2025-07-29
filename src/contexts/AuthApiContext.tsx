import { createContext, ReactNode } from "react";
import FirebaseAuthApi from "../services/firebase-auth-api";

export const AuthApiContext = createContext<FirebaseAuthApi | null>(null);

export function AuthApiContextProvider({ children }: { children: ReactNode }) {
  const authApi = new FirebaseAuthApi();

  return (
    <AuthApiContext.Provider value={authApi}>
      {children}
    </AuthApiContext.Provider>
  );
}
