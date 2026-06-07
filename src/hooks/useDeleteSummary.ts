import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articleSummaryApi } from "../services/article-summary-api";
import type { ErrorResponse } from "../types/error-response";

export function useDeleteSummary(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation<null, ErrorResponse, void>({
    mutationFn: async () => {
      const result = await articleSummaryApi.delete(articleId);
      if (result.isErr()) throw result.unwrap() as ErrorResponse;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", "summary", articleId] });
    },
  });
}
