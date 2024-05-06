type Status = "Draft" | "Published" | "Deleted";

export type Article = {
  id: number;
  title: string;
  body: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export type NewArticle = {
  title: string;
  body: string;
  status: Status;
}

export type UpdateArticle = {
  title: string | null;
  body: string | null;
  status: Status | null;
}