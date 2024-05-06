import { Grid, Stack, Typography } from "@mui/material";
import { Card } from "@mui/material";
import { useState, useEffect } from "react";
import type { Article } from "../types/article";
import { ArticleApiLocal } from "../services/article_api";
import { useNavigate } from "react-router-dom";

function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Array<Article>>([]);

  useEffect(() => {
    ArticleApiLocal.getArticles().then((articles) => {
      setArticles(articles);
    });
  }, []);

  const onClickArticle = (article: Article) => {
    navigate(`/article/${article.id}`);
  }

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