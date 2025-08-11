export type ArticleStatus = "Draft" | "Private" | "Published" | "Deleted";

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
