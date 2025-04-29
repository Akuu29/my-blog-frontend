import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import PageLayout from "../components/layout/PageLayout";
import CategoryWidget from "../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import CalendarWidget from "../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import ArticleAdminMenu from "./Articles/ArticleAdminMenu";

import ArticleApi from "../services/article-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import type { Article } from "../types/article";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import type { UserStatusContextProps } from "../types/user-status-context";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  },
});

function Article() {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
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

  const deleteArticle = async () => {
    const result = await ArticleApi.delete(Number(article_id));

    if (result.isOk()) {
      navigate("/");
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
    }
  };

  const editArticle = () => {
    navigate(`/editor/${article_id}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <PageLayout
          leftSideBar={leftSideBar}
          rightSideBar={rightSideBar}
        >
          <Grid container spacing={1} alignItems={"flex-end"} sx={{ padding: 2 }}>
            <Grid item xs={12}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Typography variant="h4">
                  {article?.title}
                </Typography>
                {userStatus.isLoggedIn && (
                  <ArticleAdminMenu
                    deleteArticle={deleteArticle}
                    editArticle={editArticle}
                  />
                )}
              </Box>
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
              <MarkdownPreview
                source={article?.body}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  fontFamily: "string",
                }}
                skipHtml={true}
                rehypePlugins={[rehypeSanitize]}
              />
            </Grid>
          </Grid >
        </PageLayout>
      </Grid>
    </ThemeProvider>
  );
}

export default Article;
