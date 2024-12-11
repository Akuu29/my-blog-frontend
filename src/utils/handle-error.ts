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
    .with(400, () => openSnackbar(vertical, horizontal, error.message))
    .with(401, () => navigator("/signin"))
    .with(403, () => openSnackbar(vertical, horizontal, error.message))
    .with(404, () => openSnackbar(vertical, horizontal, error.message))
    .with(500, () => openSnackbar(vertical, horizontal, error.message))
    .exhaustive();
}

export default handleError;
