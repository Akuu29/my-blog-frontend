export type Tag = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type NewTag = {
  name: string;
};

export type TagFilter = {
  userId?: string;
};
