export type Category = {
  id: number;
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

export type ArticlesByCategory = {
  article_id: number;
  article_title: string;
  category_name: string;
}
