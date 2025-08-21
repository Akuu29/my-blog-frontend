import { useNavigate } from 'react-router-dom';
import { match } from "ts-pattern";
import type { ErrorResponse } from "../types/error-response";

function handleError(
  error: ErrorResponse,
  navigator: ReturnType<typeof useNavigate>,
  openSnackbar: (vertical: "top" | "bottom", horizontal: "left" | "center" | "right", message: string) => void,
  vertical: "top" | "bottom",
  horizontal: "left" | "center" | "right",
) {
  match(error.status)
    .with(401, () => navigator("/signin"))
    .otherwise(() => openSnackbar(vertical, horizontal, error.message));
}

export default handleError;
