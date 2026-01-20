export type ArticleStatus = "draft" | "private" | "published" | "deleted";

export type Article = {
  id: string;
  title: string;
  body: string;
  status: ArticleStatus;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewArticle = {
  title?: string;
  body?: string;
  status: ArticleStatus;
  categoryId?: string;
};

export type UpdateArticle = {
  title: string | null;
  body: string | null;
  status: ArticleStatus | null;
  categoryId: string | null;
};

export type ArticleFilter = {
  status?: ArticleStatus;
  categoryId?: string;
  titleContains?: string;
  userId?: string;
};

export type ArticlesByTagFilter = {
  tagIds: Array<string>;
  userId?: string;
  articleStatus?: ArticleStatus;
};
