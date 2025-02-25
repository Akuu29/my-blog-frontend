import { useState, useEffect, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";

import PageLayout from "../../components/layout/PageLayout";
import CalendarWidget from "../../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import TagWidget from "../../components/layout/side-bar-widget/TagWidget/TagWidget";
import ArticleList from "./ArticleList";

import ArticleApi from "../../services/article-api";
import { useNavigate } from "react-router-dom";
import handleError from "../../utils/handle-error";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import type { Article } from "../../types/article";
import type { ErrorSnackbarContextProps } from "../../types/error-snackbar-context";
import { Tag } from "../../types/tag";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

function Articles() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [articles, setArticles] = useState<Array<Article>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  useEffect(() => {
    (async () => {

      const result = selectedTags.length > 0 ?
        await ArticleApi.findByTag(selectedTags) :
        await ArticleApi.all();

      if (result.isOk()) {
        setArticles(result.unwrap());
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
      }
    })();
  }, [navigate, openSnackbar, selectedTags]);

  const leftSideBar = (
    <Stack spacing={1}>
      <CalendarWidget />
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      <CategoryWidget />
      <TagWidget setSelectedTags={setSelectedTags} />
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
        <ArticleList articles={articles} />
      </PageLayout>
    </ThemeProvider >
  );
}

export default Articles;
