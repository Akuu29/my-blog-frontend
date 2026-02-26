import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import ArticleAdminMenu from "./ArticleAdminMenu";
import ArticleApi from "../../../services/article-api";
import handleError from "../../../utils/handle-error";
import { ErrorSnackbarContext } from "../../../contexts/ErrorSnackbarContext";
import type { Article, ArticleStatus } from "../../../types/article";
import type { ErrorSnackbarContextProps } from "../../../types/error-snackbar-context";

type ArticleListWithStatusProps = {
  articles: Array<Article>;
  userId?: string;
}

function ArticleListWithStatus({ articles, userId }: ArticleListWithStatusProps) {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const getStatusBadge = (status: ArticleStatus) => {
    const config = {
      published: { label: "Published", color: "success" as const },
      draft: { label: "Draft", color: "default" as const },
      private: { label: "Private", color: "warning" as const },
      deleted: { label: "Deleted", color: "error" as const }
    };
    const { label, color } = config[status];
    return <Chip label={label} color={color} size="small" />;
  };

  const deleteArticle = async (articleId: string) => {
    const result = await ArticleApi.delete(articleId);

    if (result.isOk()) {
      window.location.reload();
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
    }
  };

  const editArticle = (articleId: string) => {
    navigate(`/editor/${articleId}`);
  };

  const onClickArticle = (article: Article) => {
    if (userId) {
      navigate(`/user/${userId}/article/${article.id}`);
    } else {
      navigate(`/article/${article.id}`);
    }
  };

  if (articles.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="text.secondary">
          No articles found.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} direction="column">
      {articles.map((article) => (
        <Card
          variant="elevation"
          key={article.id}
          sx={{ height: 230, padding: 1, cursor: "pointer" }}
          onClick={() => onClickArticle(article)}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Typography variant="h5">
                  {article.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusBadge(article.status)}
                  <div onClick={(e) => e.stopPropagation()}>
                    <ArticleAdminMenu
                      deleteArticle={() => deleteArticle(article.id)}
                      editArticle={() => editArticle(article.id)}
                    />
                  </div>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {format(article.updatedAt, "MMMM dd, yyyy")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}>
                <MarkdownPreview
                  source={article.body}
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    fontFamily: "string",
                  }}
                  skipHtml={true}
                  rehypePlugins={[rehypeSanitize]}
                />
              </div>
            </Grid>
          </Grid>
        </Card>
      ))}
    </Stack>
  );
}

export default ArticleListWithStatus;
