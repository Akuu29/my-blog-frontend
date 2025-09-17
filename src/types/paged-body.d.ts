export type Cursor = string & { readonly __brand: "Cursor" };

export type PagedBody<T> = {
  readonly items: Array<T>;
  readonly nextCursor: Cursor | null;
  readonly hasNext: boolean;
  readonly total: number;
};
