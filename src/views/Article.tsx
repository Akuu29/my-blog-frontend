import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";

import ArticleApi from "../services/article-api";
import type { Article } from "../types/article";

function Article() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    ArticleApiLocal.getArticle(Number(id)).then((article) => {
      setArticle(article);
    })
  }, [id]);

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
