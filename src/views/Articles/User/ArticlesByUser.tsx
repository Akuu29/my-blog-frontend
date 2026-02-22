import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PageLayout from "../../../components/layout/PageLayout";
import CalendarWidget from "../../../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../../../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import TagWidget from "../../../components/layout/side-bar-widget/TagWidget/TagWidget";
import ArticleList from "../components/ArticleList";

import ArticleApi from "../../../services/article-api";
import handleError from "../../../utils/handle-error";
import { useEffect as useEffectReact } from "react";
import { ErrorSnackbarContext } from "../../../contexts/ErrorSnackbarContext";
import type { Article } from "../../../types/article";
import type { ErrorSnackbarContextProps } from "../../../types/error-snackbar-context";
import type { Tag } from "../../../types/tag";
import type { Cursor } from "../../../types/paged-body";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

const ARTICLES_PER_PAGE = 7;

interface ArticlesByUserProps {
  userId?: string;
  userName?: string;
}

function ArticlesByUser(props?: ArticlesByUserProps) {
  const navigate = useNavigate();
  const { userId: userIdFromParams } = useParams();
  const location = useLocation();
  const userNameFromState = (location.state as { userName?: string } | null)?.userName;

  const userId = props?.userId ?? userIdFromParams;
  const userName = props?.userName ?? userNameFromState;

  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const [articles, setArticles] = useState<Array<Article>>([]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const cursorRef = useRef<Cursor | null>(null);
  const loadingRef = useRef<boolean>(false);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef<boolean>(true);

  const moreArticles = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    if (!userId) return;

    loadingRef.current = true;

    try {
      const result = selectedTags.length > 0
        ? await ArticleApi.findByTag({ tagIds: selectedTags.map(t => t.id), userId: userId as string }, { cursor: cursorRef.current, perPage: ARTICLES_PER_PAGE })
        : await ArticleApi.all(
          { status: "published", userId: userId },
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
  }, [userId, selectedTags, navigate]);

  useEffect(() => {
    setArticles([]);
    cursorRef.current = null;
    hasMoreRef.current = true;
  }, [userId, selectedTags]);

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

  useEffectReact(() => {
    if (!userId) {
      alert("Failed to get articles");
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  }, [userId, navigate]);

  const leftSideBar = (
    <Stack spacing={1}>
      {userId && <CalendarWidget userId={userId} />}
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      {userId && <CategoryWidget userId={userId} showAdminMenu={false} />}
      {userId && <TagWidget setSelectedTags={setSelectedTags} userId={userId} showAdminMenu={false} />}
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
        <Stack spacing={2} sx={{ margin: 5 }}>
          {/* Page Title */}
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: "monospace", fontSize: "1.25rem" }}>
              {`${userName}'s Public Articles`}
            </Typography>
          </Box>
          {/* Article List */}
          <ArticleList articles={articles} userId={userId} />
        </Stack>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {loadingRef.current && <p>Loading...</p>}
          <div ref={loadingIndicatorRef} />
        </Box>
      </PageLayout>
    </ThemeProvider>
  );
}

export default ArticlesByUser;
