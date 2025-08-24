export type PagedBody<T> = {
  items: T[];
  nextCursor: string | null;
};
