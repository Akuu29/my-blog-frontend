import { useContext } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";

import ArticleApi from "../services/article-api";
import { useNavigate } from "react-router-dom";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { Article } from "../types/article";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";


function Articles() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [articles, setArticles] = useState<Array<Article>>([]);

  useEffect(() => {
    (async () => {
      const result = await ArticleApi.all();

      if (result.isOk()) {
        setArticles(result.unwrap());
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      }
    })();
  }, [navigate, openSnackbar]);

  const onClickArticle = (article: Article) => {
    navigate(`/article/${article.id}`);
  };

  return (
    <Stack spacing={2} direction="column" sx={{ margin: 3 }}>
      {articles.map((article => (
        <Card sx={{ height: 275 }} variant="elevation" key={article.id} onClick={() => onClickArticle(article)}>
          <Grid container spacing={2} alignItems={"flex-end"}>
            <Grid item>
              <Typography variant="h4">
                {article.title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                created: {article.createdAt}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                updated: {article.updatedAt}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {article.body}
            </Grid>
          </Grid>
        </Card>
      )))}
    </Stack>
  );
}

export default Articles;
