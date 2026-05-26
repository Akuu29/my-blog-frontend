import { useQuery } from "@tanstack/react-query";
import { articleApi } from "../services/article-api";
import type { Article } from "../types/article";

const ARTICLE_DETAIL_STALE_TIME = 30 * 60 * 1000; // 30 min
const ARTICLE_DETAIL_GC_TIME = 2 * 60 * 60 * 1000; // 2 hours

export function useArticle(articleId: string) {
  return useQuery({
    queryKey: ["articles", "detail", articleId],
    queryFn: async () => {
      const result = await articleApi.find(articleId);
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as Article;
    },
    staleTime: ARTICLE_DETAIL_STALE_TIME,
    gcTime: ARTICLE_DETAIL_GC_TIME,
    enabled: !!articleId,
  });
}
