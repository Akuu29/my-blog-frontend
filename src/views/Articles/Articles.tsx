import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import PageLayout from "../../components/layout/PageLayout";
import CalendarWidget from "../../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import TagWidget from "../../components/layout/side-bar-widget/TagWidget/TagWidget";
import ArticleList from "./ArticleList";

import ArticleApi from "../../services/article-api";
import { useNavigate } from "react-router-dom";
import handleError from "../../utils/handle-error";
import { ErrorSnackbarContext } from "../../contexts/ErrorSnackbarContext";
import { UserStatusContext } from "../../contexts/UserStatusContext";
import type { Article } from "../../types/article";
import type { Tag } from "../../types/tag";
import type { ErrorSnackbarContextProps } from "../../types/error-snackbar-context";
import type { UserStatusContextProps } from "../../types/user-status-context";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

const ARTICLES_PER_PAGE = 7;

function Articles() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
  const [articles, setArticles] = useState<Array<Article>>([]);
  const cursorRef = useRef<number | null>(null);
  const loadingRef = useRef<boolean>(false);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef<boolean>(true);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  const moreArticles = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;

    const result = selectedTags.length > 0 ?
      await ArticleApi.findByTag({ tagIds: selectedTags.map((tag) => tag.id) }, { cursor: cursorRef.current, perPage: ARTICLES_PER_PAGE }) :
      await ArticleApi.all({ status: "published" }, { cursor: cursorRef.current, perPage: ARTICLES_PER_PAGE });

    if (result.isOk()) {
      const body = result.unwrap();
      setArticles((prev) => [...prev, ...body.items]);

      if (body.nextCursor) {
        cursorRef.current = body.nextCursor;
      } else {
        hasMoreRef.current = false;
      }

    } else if (result.isErr()) {
      handleError(result.unwrap(), navigate, openSnackbar, "top", "center");
    }

    loadingRef.current = false;
  }, [selectedTags, navigate]);

  // Reset articles and cursor when tags change
  useEffect(() => {
    setArticles([]);
    cursorRef.current = null;
    hasMoreRef.current = true;
  }, [selectedTags]);

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
        <Stack spacing={2} sx={{ margin: 5 }}>
          {userStatus.isLoggedIn && (
            <IconButton
              disableRipple={true}
              sx={{
                cursor: "pointer"
              }}
              onClick={() => { navigate("/editor"); }}>
              <AddIcon />
              <Typography
                sx={{
                  fontWeight: 600,
                }}>
                Add New Article
              </Typography>
            </IconButton>
          )}
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
