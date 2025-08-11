export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type NewCategory = {
  name: string;
};

export type UpdateCategory = {
  name: string;
};

export type CategoryFilter = {
  id?: string;
  name?: string;
};
