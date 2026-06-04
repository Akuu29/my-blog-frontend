import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";

import type { ArticleSummary } from "../../../../types/article-summary";

type ArticleSummaryDisplayProps = {
  summary: ArticleSummary | null | undefined;
  isPending: boolean;
  isError: boolean;
};

function ArticleSummaryDisplay({ summary, isPending, isError }: ArticleSummaryDisplayProps) {
  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" variant="body2">
        Failed to load summary.
      </Typography>
    );
  }

  if (!summary) {
    return (
      <Typography variant="body2" color="text.secondary">
        No summary has been generated yet.
      </Typography>
    );
  }

  return (
    <Box>
      <MarkdownPreview
        source={summary.content}
        style={{ backgroundColor: "transparent", color: "inherit", fontSize: "0.875rem" }}
        wrapperElement={{ "data-color-mode": "light" }}
        skipHtml={true}
        rehypePlugins={[rehypeSanitize]}
      />
    </Box>
  );
}

export default ArticleSummaryDisplay;
