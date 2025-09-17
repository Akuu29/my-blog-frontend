import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import PageLayout from "../../../components/layout/PageLayout";
import ArticleList from "../components/ArticleList";

import ArticleApi from "../../../services/article-api";
import { useNavigate } from "react-router-dom";
import handleError from "../../../utils/handle-error";
import { ErrorSnackbarContext } from "../../../contexts/ErrorSnackbarContext";
import type { Article } from "../../../types/article";
import type { ErrorSnackbarContextProps } from "../../../types/error-snackbar-context";
import type { Cursor } from "../../../types/paged-body";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

const ARTICLES_PER_PAGE = 7;

function Articles() {
  const navigate = useNavigate();

  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const [articles, setArticles] = useState<Array<Article>>([]);
  const cursorRef = useRef<Cursor | null>(null);
  const loadingRef = useRef<boolean>(false);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef<boolean>(true);

  const moreArticles = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;

    try {
      const result = await ArticleApi.all(
        { status: "published" },
        { cursor: cursorRef.current, perPage: ARTICLES_PER_PAGE }
      );

      if (result.isOk()) {
        const body = result.unwrap();
        setArticles((prev) => [...prev, ...body.items]);

        if (body.nextCursor != null) {
          cursorRef.current = body.nextCursor;
        } else {
          hasMoreRef.current = false;
        }
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
      }
    } finally {
      loadingRef.current = false;
    }
  }, [navigate]);

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
      {/* TODO */}
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      {/* TODO */}
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
        <Stack spacing={2} sx={{ margin: 5 }}>
          <ArticleList articles={articles} />
        </Stack>
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
