import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { format } from "date-fns";

import PageLayout from "../components/layout/PageLayout";
import CategoryWidget from "../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import CalendarWidget from "../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";

import ArticleApi from "../services/article-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { Article } from "../types/article";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import { Stack } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  },
});

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

  const leftSideBar = (
    <Stack spacing={1}>
      <CalendarWidget />
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      <CategoryWidget />
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <PageLayout
          leftSideBar={leftSideBar}
          rightSideBar={rightSideBar}
        >
          <Grid container spacing={1} alignItems={"flex-end"} sx={{ padding: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h4">
                {article?.title}
              </Typography>
            </Grid>
            {article?.createdAt && (
              <Grid item xs={6}>
                <Typography variant="body1" color="text.secondary">
                  created: {format(article!.createdAt, "MMMM dd, yyyy")}
                </Typography>
              </Grid>
            )}
            {article?.updatedAt !== article?.createdAt && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  updated: {format(article!.updatedAt, "MMMM dd, yyyy")}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}>
                {article?.body}
              </Typography>
            </Grid>
          </Grid >
        </PageLayout>
      </Grid>
    </ThemeProvider >
  );
}

export default Article;
