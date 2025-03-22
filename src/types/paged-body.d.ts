export type PagedBody<T> = {
  items: T[];
  nextCursor: number | null;
};
