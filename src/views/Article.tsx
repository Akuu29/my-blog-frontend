import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";

import ArticleApi from "../services/article-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { Article } from "../types/article";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";

function Article() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const { article_id } = useParams<{ article_id: string }>();
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    (async () => {
      if (article_id) {
        const result = await ArticleApi.find(Number(article_id));

        if (result.isOk()) {
          setArticle(result.unwrap());
        } else if (result.isErr()) {
          handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
        }
      }
    })();
  }, [article_id, navigate, openSnackbar]);

  return (
    <Grid container spacing={2} alignItems={"flex-end"}>
      <Grid item>
        <Typography variant="h4">
          {article?.title}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          created: {article?.createdAt}
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1">
          updated: {article?.updatedAt}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {article?.body}
      </Grid>
    </Grid>
  );
}

export default Article;
