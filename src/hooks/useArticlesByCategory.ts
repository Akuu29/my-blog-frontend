import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { articleApi } from "../services/article-api";
import { ARTICLES_PER_PAGE } from "../config/constants";
import type { Article } from "../types/article";
import type { PagedBody } from "../types/paged-body";

const ARTICLES_STALE_TIME = 5 * 60 * 1000; // 5 min

export function useArticlesByCategory(categoryId: string, page: number) {
  const queryClient = useQueryClient();
  const perPage = ARTICLES_PER_PAGE;
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const offset = (safePage - 1) * perPage;

  const query = useQuery({
    queryKey: ["articles", "list", { status: "published", categoryId, page: safePage, perPage }],
    queryFn: async () => {
      const result = await articleApi.all(
        { status: "published", categoryId },
        { offset, perPage },
      );
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as PagedBody<Article>;
    },
    staleTime: ARTICLES_STALE_TIME,
    enabled: !!categoryId,
  });

  useEffect(() => {
    if (!query.data?.hasNext) return;
    queryClient.prefetchQuery({
      queryKey: ["articles", "list", { status: "published", categoryId, page: safePage + 1, perPage }],
      queryFn: async () => {
        const result = await articleApi.all(
          { status: "published", categoryId },
          { offset: offset + perPage, perPage },
        );
        if (result.isErr()) throw result.unwrap();
        return result.unwrap() as PagedBody<Article>;
      },
      staleTime: ARTICLES_STALE_TIME,
    });
  }, [safePage, query.data?.hasNext, queryClient, categoryId, offset, perPage]);

  return query;
}
