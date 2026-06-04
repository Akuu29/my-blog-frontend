import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articleSummaryApi } from "../services/article-summary-api";
import type { ArticleSummary, GenerateSummaryParams } from "../types/article-summary";
import type { ErrorResponse } from "../types/error-response";

export function useGenerateSummary(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation<ArticleSummary, ErrorResponse, GenerateSummaryParams>({
    mutationFn: async (params) => {
      const result = await articleSummaryApi.generate(articleId, params);
      if (result.isErr()) throw result.unwrap() as ErrorResponse;
      return result.unwrap() as ArticleSummary;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", "summary", articleId] });
    },
  });
}
