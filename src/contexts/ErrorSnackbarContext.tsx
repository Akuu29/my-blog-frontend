import { createContext, ReactNode, useState } from "react";
import type { ErrorSnackbarContextProps, snackbarState } from "../types/error_snackbar_context";

export const ErrorSnackbarContext = createContext<ErrorSnackbarContextProps | null>(null);

export function ErrorSnackbarContextProvider({ children }: { children: ReactNode }) {
  const [snackbarState, setSnackbarState] = useState<snackbarState>({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "",
  });

  const openSnackbar = (
    vertical: "top" | "bottom",
    horizontal: "left" | "center" | "right",
    message: string,
  ) => {
    setSnackbarState({
      open: true,
      vertical,
      horizontal,
      message: message,
    });
  };

  const closeSnackbar = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  return (
    <ErrorSnackbarContext.Provider value={{ snackbarState, openSnackbar, closeSnackbar }}>
      {children}
    </ErrorSnackbarContext.Provider>
  );
}
