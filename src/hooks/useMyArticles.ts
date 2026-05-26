import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { articleApi } from "../services/article-api";
import { ARTICLES_PER_PAGE } from "../config/constants";
import type { ArticleStatus } from "../types/article";
import type { Article } from "../types/article";
import type { PagedBody } from "../types/paged-body";

const MY_ARTICLES_STALE_TIME = 5 * 60 * 1000; // 5 min

export function useMyArticles(
  userId: string,
  status: ArticleStatus,
  tagIds: string[],
  page: number,
) {
  const queryClient = useQueryClient();
  const perPage = ARTICLES_PER_PAGE;
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const offset = (safePage - 1) * perPage;

  const query = useQuery({
    queryKey: ["articles", "list", { status, userId, tagIds, safePage, perPage }],
    queryFn: async () => {
      const result = tagIds.length > 0
        ? await articleApi.findByTag(
          { tagIds, userId, articleStatus: status },
          { offset, perPage },
        )
        : await articleApi.all(
          { status, userId },
          { offset, perPage },
        );
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as PagedBody<Article>;
    },
    staleTime: MY_ARTICLES_STALE_TIME,
    enabled: !!userId,
  });

  useEffect(() => {
    if (!query.data?.hasNext) return;
    queryClient.prefetchQuery({
      queryKey: ["articles", "list", { status, userId, tagIds, page: safePage + 1, perPage }],
      queryFn: async () => {
        const result = tagIds.length > 0
          ? await articleApi.findByTag(
            { tagIds, userId, articleStatus: status },
            { offset: offset + perPage, perPage },
          )
          : await articleApi.all(
            { status, userId },
            { offset: offset + perPage, perPage },
          );
        if (result.isErr()) throw result.unwrap();
        return result.unwrap() as PagedBody<Article>;
      },
      staleTime: MY_ARTICLES_STALE_TIME,
    });
  }, [safePage, query.data?.hasNext, queryClient, userId, status, tagIds, offset, perPage]);

  return query;
}
