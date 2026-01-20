export type User = {
  id: string; // UUID v4
  name: string;
};

export type UserFilter = {
  nameContains?: string;
};
