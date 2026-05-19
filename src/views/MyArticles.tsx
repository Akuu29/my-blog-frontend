import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AddIcon from "@mui/icons-material/Add";

import PageLayout from "../components/layout/PageLayout";
import CalendarWidget from "../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import TagWidget from "../components/layout/side-bar-widget/TagWidget/TagWidget";
import ArticleListWithStatus from "./Articles/components/ArticleListWithStatus";
import { articleApi } from "../services/article-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import { UserStatusContext } from "../contexts/UserStatusContext";
import type { Article, ArticleStatus } from "../types/article";
import type { Tag } from "../types/tag";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import type { UserStatusContextProps } from "../types/user-status-context";
import type { Cursor } from "../types/paged-body";

const ARTICLES_PER_PAGE = 7;

type MyArticlesTab = "published" | "private";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

function MyArticles() {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  // Manage tab
  const [currentTab, setCurrentTab] = useState<MyArticlesTab>("published");

  // Manage article status
  const [publishedArticles, setPublishedArticles] = useState<Article[]>([]);
  const [privateArticles, setPrivateArticles] = useState<Article[]>([]);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);

  // Pagination
  const publishedCursorRef = useRef<Cursor | null>(null);
  const privateCursorRef = useRef<Cursor | null>(null);
  const loadingRef = useRef<boolean>(false);
  const loadingIndicatorRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef<{
    published: boolean;
    private: boolean;
  }>({ published: true, private: true });

  // Call API
  const loadMoreArticles = useCallback(async (targetStatus: MyArticlesTab) => {
    if (loadingRef.current || !hasMoreRef.current[targetStatus]) return;
    if (!userStatus.currentUserId) return;

    loadingRef.current = true;

    try {
      const cursorMap = {
        published: publishedCursorRef,
        private: privateCursorRef
      };

      const result = selectedTags.length > 0
        ? await articleApi.findByTag(
          { tagIds: selectedTags.map(t => t.id), userId: userStatus.currentUserId, articleStatus: targetStatus },
          { cursor: cursorMap[targetStatus].current, perPage: ARTICLES_PER_PAGE }
        )
        : await articleApi.all(
          { status: targetStatus, userId: userStatus.currentUserId },
          { cursor: cursorMap[targetStatus].current, perPage: ARTICLES_PER_PAGE }
        );

      if (result.isOk()) {
        const body = result.unwrap();

        const setterMap = {
          published: setPublishedArticles,
          private: setPrivateArticles
        };
        setterMap[targetStatus]((prev) => [...prev, ...body.items]);

        if (body.nextCursor != null) {
          cursorMap[targetStatus].current = body.nextCursor;
        } else {
          hasMoreRef.current[targetStatus] = false;
        }
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
      }
    } finally {
      loadingRef.current = false;
    }
  }, [userStatus.currentUserId, selectedTags, navigate]);

  // Switching tabs
  const handleTabChange = (_event: React.SyntheticEvent, newValue: ArticleStatus) => {
    if (newValue !== "published" && newValue !== "private") return;
    setCurrentTab(newValue);

    // If the article in the new tab is not loaded, load it for the first time
    const articlesMap = {
      published: publishedArticles,
      private: privateArticles
    };

    if (articlesMap[newValue].length === 0 && hasMoreRef.current[newValue]) {
      loadMoreArticles(newValue);
    }
  };

  // Reset scroll position to top when switching tabs
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab]);

  // Reset articles when selectedTags or currentTab changes
  useEffect(() => {
    setPublishedArticles([]);
    setPrivateArticles([]);
    publishedCursorRef.current = null;
    privateCursorRef.current = null;
    hasMoreRef.current = { published: true, private: true };
  }, [selectedTags, currentTab]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        loadMoreArticles(currentTab);
      }
    }, { threshold: 1 });

    if (loadingIndicatorRef.current) {
      observer.observe(loadingIndicatorRef.current);
    }

    return () => observer.disconnect();
  }, [currentTab, loadMoreArticles]);

  // Initial load
  useEffect(() => {
    if (publishedArticles.length === 0 && hasMoreRef.current.published) {
      loadMoreArticles("published");
    }
  }, [loadMoreArticles, publishedArticles.length]);

  // Nothing is displayed before authentication
  if (userStatus.isInitializing || !userStatus.isLoggedIn || !userStatus.currentUserId) {
    return null;
  }

  // Get the article for the current tab
  const getCurrentArticles = () => {
    switch (currentTab) {
      case "published": return publishedArticles;
      case "private": return privateArticles;
      default: return [];
    }
  };

  const leftSideBar = (
    <Stack spacing={1}>
      {userStatus.currentUserId && <CalendarWidget userId={userStatus.currentUserId} />}
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      {userStatus.currentUserId && <CategoryWidget userId={userStatus.currentUserId} showAdminMenu={true} />}
      {userStatus.currentUserId && <TagWidget setSelectedTags={setSelectedTags} userId={userStatus.currentUserId} showAdminMenu={true} />}
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
        <Stack spacing={2} sx={{ margin: 5 }}>
          {/* Header */}
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Typography variant="h4" sx={{ fontFamily: "monospace" }}>
              My Articles
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/editor")}
            >
              New Article
            </Button>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="article status tabs"
            >
              <Tab label="Published" value="published" />
              <Tab label="Private" value="private" />
            </Tabs>
          </Box>

          {/* Article list */}
          <ArticleListWithStatus
            articles={getCurrentArticles()}
            userId={userStatus.currentUserId}
          />
        </Stack>

        {/* Loading article */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {loadingRef.current && <Typography>Loading...</Typography>}
          <div ref={loadingIndicatorRef} />
        </Box>
      </PageLayout>
    </ThemeProvider>
  );
}

export default MyArticles;
