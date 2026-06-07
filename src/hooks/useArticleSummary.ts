import { useQuery } from "@tanstack/react-query";
import { articleSummaryApi } from "../services/article-summary-api";
import type { ArticleSummary } from "../types/article-summary";
import type { ErrorResponse } from "../types/error-response";

const SUMMARY_STALE_TIME = 30 * 60 * 1000; // 30 min

export function useArticleSummary(articleId: string) {
  return useQuery<ArticleSummary | null, ErrorResponse>({
    queryKey: ["articles", "summary", articleId],
    queryFn: async () => {
      const result = await articleSummaryApi.get(articleId);
      if (result.isErr()) {
        const err = result.unwrap() as ErrorResponse;
        if (err.status === 404) return null;
        throw err;
      }
      return result.unwrap() as ArticleSummary;
    },
    staleTime: SUMMARY_STALE_TIME,
    enabled: !!articleId,
  });
}
