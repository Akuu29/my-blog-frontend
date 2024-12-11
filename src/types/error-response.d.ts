type ErrorStatusCodes = 400 | 401 | 403 | 404 | 500;

export type ErrorResponse = {
  message: string;
  status: ErrorStatusCodes;
};
