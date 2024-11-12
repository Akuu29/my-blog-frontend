import { type SnackbarOrigin } from "@mui/material";

export interface snackbarState extends SnackbarOrigin {
  open: boolean;
  message: string;
}

export type ErrorSnackbarContextProps = {
  snackbarState: snackbarState;
  openSnackbar: (
    vertical: "top" | "bottom",
    horizontal: "left" | "center" | "right",
    message: string,
  ) => void;
  closeSnackbar: () => void;
};
