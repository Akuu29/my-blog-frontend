import { useState, useEffect, useContext } from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { Card } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import ArticleApi from "../services/article-api";
import { useNavigate } from "react-router-dom";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import type { Article } from "../types/article";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import type { UserStatusContextProps } from "../types/user-status-context";


function Articles() {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
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
      {userStatus.isLoggedIn && (
        <IconButton
          disableRipple={true}
          sx={{
            cursor: "pointer"
          }}
          onClick={() => { navigate("/editor"); }}>
          <AddIcon />
          <Typography sx={{
            fontFamily: 'monospace',
            variant: "h1",
            fontWeight: 600,
          }}>
            Add New Article
          </Typography>
        </IconButton>
      )}
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
