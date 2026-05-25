import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";

import PageLayout from "../components/layout/PageLayout";
import CalendarWidget from "../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import TagWidget from "../components/layout/side-bar-widget/TagWidget/TagWidget";
import ArticleListWithStatus from "./Articles/components/ArticleListWithStatus";
import { useMyArticles } from "../hooks/useMyArticles";
import { UserStatusContext } from "../contexts/UserStatusContext";
import { ARTICLES_PER_PAGE } from "../config/constants";
import type { Tag } from "../types/tag";
import type { ArticleStatus } from "../types/article";
import type { UserStatusContextProps } from "../types/user-status-context";

type MyArticlesTab = "published" | "private";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

function MyArticles() {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;

  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = (searchParams.get("tab") ?? "published") as MyArticlesTab;
  const page = Number(searchParams.get("page") ?? "1");

  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const selectedTagIds = useMemo(() => selectedTags.map(t => t.id), [selectedTags]);

  const userId = userStatus.currentUserId ?? "";
  const { data, isPending, isError } = useMyArticles(
    userId,
    currentTab as ArticleStatus,
    selectedTagIds,
    page,
  );

  const totalPages = Math.ceil((data?.total ?? 0) / ARTICLES_PER_PAGE);

  const handleTabChange = (_: React.SyntheticEvent, newValue: MyArticlesTab) => {
    setSearchParams({ tab: newValue, page: "1" });
    window.scrollTo(0, 0);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ tab: currentTab, page: String(value) });
    window.scrollTo(0, 0);
  };

  // Reset page to 1 when tags change
  const prevTagIdsRef = useRef(selectedTagIds.join(","));
  useEffect(() => {
    const serialized = selectedTagIds.join(",");
    if (prevTagIdsRef.current === serialized) return;
    prevTagIdsRef.current = serialized;
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  }, [selectedTagIds, setSearchParams]);

  useEffect(() => {
    if (!userId) {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate("/");
      }
    }
  }, [userId, navigate]);

  if (userStatus.isInitializing || !userStatus.isLoggedIn || !userStatus.currentUserId) {
    return null;
  }

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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="article status tabs">
              <Tab label="Published" value="published" />
              <Tab label="Private" value="private" />
            </Tabs>
          </Box>

          {/* Article list */}
          {isPending && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}
          {isError && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <Typography color="error">記事の取得に失敗しました。</Typography>
            </Box>
          )}
          {data && (
            <ArticleListWithStatus
              articles={data.items}
              userId={userStatus.currentUserId}
            />
          )}
        </Stack>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", pb: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </PageLayout>
    </ThemeProvider>
  );
}

export default MyArticles;
