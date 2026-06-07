import { useContext } from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { ErrorSnackbarContext } from "../../../../contexts/ErrorSnackbarContext";
import { useArticleSummary } from "../../../../hooks/useArticleSummary";
import { useGenerateSummary } from "../../../../hooks/useGenerateSummary";
import { useDeleteSummary } from "../../../../hooks/useDeleteSummary";
import { getSummaryErrorMessage } from "../../../../services/article-summary-api";
import ArticleSummaryDisplay from "./ArticleSummaryDisplay";
import ArticleSummaryAdmin from "./ArticleSummaryAdmin";
import type { ArticleStatus } from "../../../../types/article";
import type { SummaryLang } from "../../../../types/article-summary";

type ArticleSummarySectionProps = {
  articleId: string;
  articleStatus: ArticleStatus;
  isOwner: boolean;
};

function ArticleSummarySection({ articleId, articleStatus, isOwner }: ArticleSummarySectionProps) {
  const snackbarContext = useContext(ErrorSnackbarContext);

  const { data: summary, isPending, isError } = useArticleSummary(articleId);
  const generateMutation = useGenerateSummary(articleId);
  const deleteMutation = useDeleteSummary(articleId);

  const canGenerate = isOwner && !isPending && (articleStatus === "published" || articleStatus === "private");

  const showError = (status: number) => {
    snackbarContext?.openSnackbar("top", "center", getSummaryErrorMessage(status));
  };

  const handleGenerate = (lang: SummaryLang) => {
    generateMutation.mutate({ lang }, {
      onError: (err) => showError(err.status),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onError: (err) => showError(err.status),
    });
  };

  return (
    <Accordion disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AutoAwesomeIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" fontWeight="bold">
            AI Summary
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <ArticleSummaryDisplay summary={summary} isPending={isPending} isError={isError} />
        {canGenerate && (
          <ArticleSummaryAdmin
            hasSummary={!!summary}
            isGenerating={generateMutation.isPending}
            isDeleting={deleteMutation.isPending}
            onGenerate={handleGenerate}
            onDelete={handleDelete}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
}

export default ArticleSummarySection;
