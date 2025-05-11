export type ArticleStatus = "Draft" | "Private" | "Published" | "Deleted";

export type Article = {
  id: number;
  title: string;
  body: string;
  status: ArticleStatus;
  categoryId: number | null;
  createdAt: string;
  updatedAt: string;
};

export type NewArticle = {
  title?: string;
  body?: string;
  status: ArticleStatus;
  categoryId?: number;
};

export type UpdateArticle = {
  title: string | null;
  body: string | null;
  status: ArticleStatus | null;
  categoryId: number | null;
};
