import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { articleApi } from "../../../services/article-api";
import handleError from "../../../utils/handle-error";
import { ErrorSnackbarContext } from "../../../contexts/ErrorSnackbarContext";
import type { Article, ArticleStatus } from "../../../types/article";
import type { ErrorResponse } from "../../../types/error-response";
import type { ErrorSnackbarContextProps } from "../../../types/error-snackbar-context";

type ArticleListWithStatusProps = {
  articles: Array<Article>;
  userId?: string;
}

function ArticleListWithStatus({ articles, userId }: ArticleListWithStatusProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const { mutate: deleteArticle } = useMutation<null, ErrorResponse, string>({
    mutationFn: async (articleId: string) => {
      const result = await articleApi.delete(articleId);
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles", "list"] });
    },
    onError: (error) => {
      handleError(error, navigate, openSnackbarRef.current, "top", "center");
    },
  });

  const { mutate: changeStatus } = useMutation<Article, ErrorResponse, { articleId: string; status: ArticleStatus }>({
    mutationFn: async ({ articleId, status }) => {
      const result = await articleApi.update(articleId, {
        title: null, body: null, status, categoryId: null,
      });
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as Article;
    },
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: ["articles", "list"] });
      queryClient.invalidateQueries({ queryKey: ["articles", "detail", article.id] });
    },
    onError: (error) => {
      handleError(error, navigate, openSnackbarRef.current, "top", "center");
    },
  });

  const getStatusBadge = (status: ArticleStatus) => {
    const config = {
      published: { label: "Published", color: "success" as const },
      private: { label: "Private", color: "warning" as const },
      deleted: { label: "Deleted", color: "error" as const },
      draft: { label: "Draft", color: "default" as const },
    };
    const { label, color } = config[status];
    return <Chip label={label} color={color} size="small" />;
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
        <Typography color="text.secondary">No articles found.</Typography>
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
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h5">{article.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusBadge(article.status)}
                  <div onClick={(e) => e.stopPropagation()}>
                    <ArticleAdminMenu
                      articleStatus={article.status}
                      deleteArticle={() => deleteArticle(article.id)}
                      editArticle={() => navigate(`/editor/${article.id}`)}
                      changeStatus={(status) => changeStatus({ articleId: article.id, status })}
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
