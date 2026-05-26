import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

import PageLayout from "../../../components/layout/PageLayout";
import CalendarWidget from "../../../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../../../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";
import TagWidget from "../../../components/layout/side-bar-widget/TagWidget/TagWidget";
import ArticleList from "../components/ArticleList";
import { userApi } from "../../../services/user-api";
import { useMyArticles } from "../../../hooks/useMyArticles";
import { ARTICLES_PER_PAGE } from "../../../config/constants";
import type { Tag } from "../../../types/tag";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

function ArticlesByUser() {
  const navigate = useNavigate();
  const { userId: userIdFromParams } = useParams();
  const location = useLocation();
  const userNameFromState = (location.state as { userName?: string } | null)?.userName;

  const userId = userIdFromParams ?? "";
  const [userName, setUserName] = useState<string | undefined>(userNameFromState);
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const selectedTagIds = useMemo(() => selectedTags.map(t => t.id), [selectedTags]);

  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const { data, isPending, isError } = useMyArticles(userId, "published", selectedTagIds, page);
  const totalPages = Math.ceil((data?.total ?? 0) / ARTICLES_PER_PAGE);

  useEffect(() => {
    if (!userName && userId) {
      userApi.find(userId).then(result => {
        if (result.isOk()) setUserName(result.unwrap().name);
      });
    }
  }, [userId, userName]);

  useEffect(() => {
    if (!userId) {
      if (window.history.length > 1) navigate(-1);
      else navigate("/");
    }
  }, [userId, navigate]);

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

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
    window.scrollTo(0, 0);
  };

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
      <PageLayout leftSideBar={leftSideBar} rightSideBar={rightSideBar}>
        <Stack spacing={2} sx={{ margin: 5 }}>
          {/* Page Title */}
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontFamily: "monospace", fontSize: "1.25rem" }}>
              {`${userName}'s Public Articles`}
            </Typography>
          </Box>

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
          {data && <ArticleList articles={data.items} userId={userId} />}
        </Stack>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", pb: 4 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
          </Box>
        )}
      </PageLayout>
    </ThemeProvider>
  );
}

export default ArticlesByUser;
