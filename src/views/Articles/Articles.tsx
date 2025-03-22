import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

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

const ARTICLES_PER_PAGE = 7;

function Articles() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [articles, setArticles] = useState<Array<Article>>([]);
  const cursorRef = useRef<number | null>(null);
  const loadingRef = useRef<boolean>(false);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  const moreArticles = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const result = selectedTags.length > 0 ?
      await ArticleApi.findByTag(selectedTags, cursorRef.current, ARTICLES_PER_PAGE) :
      await ArticleApi.all(cursorRef.current, ARTICLES_PER_PAGE);

    if (result.isOk()) {
      const body = result.unwrap();
      setArticles((prev) => [...prev, ...body.items]);

      if (body.nextCursor) {
        cursorRef.current = body.nextCursor;
      }
    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
    }

    loadingRef.current = false;
  }, [selectedTags, navigate, openSnackbar]);

  // Reset articles and cursor when tags change
  useEffect(() => {
    setArticles([]);
    cursorRef.current = null;
    moreArticles();
  }, [selectedTags, moreArticles]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        moreArticles();
      }
    }, { threshold: 1 });

    if (loadingIndicatorRef.current) {
      observer.observe(loadingIndicatorRef.current);
    }

    return () => observer.disconnect();
  }, [moreArticles]);

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
        <Box sx={{
          display: "flex",
          justifyContent: "center",
        }}>
          {loadingRef.current && <p>Loading...</p>}
          <div ref={loadingIndicatorRef} />
        </Box>
      </PageLayout>
    </ThemeProvider >
  );
}

export default Articles;
