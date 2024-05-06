import { type Article } from "../types/article";

export class ArticleApi { }

export class ArticleApiLocal extends ArticleApi {
  static async getArticles(): Promise<Array<Article>> {
    return [
      {
        id: 1,
        title: "Article 1",
        body: "Article 1 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      },
      {
        id: 2,
        title: "Article 2",
        body: "Article 2 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      },
      {
        id: 3,
        title: "Article 3",
        body: "Article 3 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      },
      {
        id: 4,
        title: "Article 4",
        body: "Article 4 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      },
      {
        id: 5,
        title: "Article 5",
        body: "Article 5 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      },
      {
        id: 6,
        title: "Article 6",
        body: "Article 6 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      },
      {
        id: 7,
        title: "Article 7",
        body: "Article 7 content",
        status: "Published",
        createdAt: "2021-10-01T00:00:00Z",
        updatedAt: "2021-10-01T00:00:00Z"
      }
    ];
  }

  static async getArticle(id: number): Promise<Article> {
    return {
      id: id,
      title: `Article ${id}`,
      body: `Article ${id} content`,
      status: "Published",
      createdAt: "2021-10-01T00:00:00Z",
      updatedAt: "2021-10-01T00:00:00Z"
    };
  }
}