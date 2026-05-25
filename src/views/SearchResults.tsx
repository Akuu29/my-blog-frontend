import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

import PageLayout from "../components/layout/PageLayout";
import ArticleList from "./Articles/components/ArticleList";
import UserList from "./UserList";
import { articleApi } from "../services/article-api";
import { userApi } from "../services/user-api";
import { ARTICLES_PER_PAGE } from "../config/constants";
import type { Article } from "../types/article";
import type { User } from "../types/user";
import type { PagedBody } from "../types/paged-body";

const SEARCH_STALE_TIME = 5 * 60 * 1000; // 5 min

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

type SearchType = 'articles' | 'users';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") ?? "";
  const currentTab = (searchParams.get("tab") ?? "articles") as SearchType;
  const page = Number(searchParams.get("page") ?? "1");

  const trimmedQuery = searchQuery.trim();

  const { data: articlesData, isPending: articlesLoading } = useQuery({
    queryKey: ["articles", "list", { status: "published", titleContains: trimmedQuery, page, perPage: ARTICLES_PER_PAGE }],
    queryFn: async () => {
      const result = await articleApi.all(
        { status: "published", titleContains: trimmedQuery },
        { offset: (page - 1) * ARTICLES_PER_PAGE, perPage: ARTICLES_PER_PAGE },
      );
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as PagedBody<Article>;
    },
    staleTime: SEARCH_STALE_TIME,
    enabled: !!trimmedQuery,
  });

  const { data: usersData, isPending: usersLoading } = useQuery({
    queryKey: ["users", "list", { nameContains: trimmedQuery }],
    queryFn: async () => {
      const result = await userApi.all(
        { nameContains: trimmedQuery },
        { offset: 0, perPage: 50 },
      );
      if (result.isErr()) throw result.unwrap();
      return result.unwrap() as PagedBody<User>;
    },
    staleTime: SEARCH_STALE_TIME,
    enabled: !!trimmedQuery,
  });

  const articles = articlesData?.items ?? [];
  const users = usersData?.items ?? [];
  const articleTotal = articlesData?.total ?? 0;
  const userTotal = usersData?.total ?? 0;
  const totalArticlePages = Math.ceil(articleTotal / ARTICLES_PER_PAGE);

  const handleTabChange = (_: React.SyntheticEvent, newValue: SearchType) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("tab", newValue);
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set("page", String(value));
      return next;
    });
    window.scrollTo(0, 0);
  };

  const isLoading = currentTab === "articles" ? articlesLoading : usersLoading;
  const hasSearched = !!trimmedQuery;

  const renderResults = () => {
    if (isLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (!hasSearched) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please enter a search term to find articles and users.
        </Alert>
      );
    }

    if (articleTotal === 0 && userTotal === 0) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No articles or users found for "{searchQuery}". Try different keywords.
        </Alert>
      );
    }

    if (currentTab === "articles") {
      return (
        <>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Found {articleTotal} article{articleTotal !== 1 ? "s" : ""}
          </Typography>
          {articles.length > 0 ? (
            <>
              <ArticleList articles={articles} />
              {totalArticlePages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination count={totalArticlePages} page={page} onChange={handlePageChange} color="primary" />
                </Box>
              )}
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No articles found for "{searchQuery}".
            </Alert>
          )}
        </>
      );
    }

    return (
      <>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Found {userTotal} user{userTotal !== 1 ? "s" : ""}
        </Typography>
        {users.length > 0 ? (
          <UserList users={users} />
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            No users found for "{searchQuery}".
          </Alert>
        )}
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={<Stack spacing={1} />}
        rightSideBar={<Stack spacing={1} />}
      >
        <Box sx={{ py: 2 }}>
          {/* Search Header */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            Search Results
          </Typography>

          {searchQuery && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Searching for: "{searchQuery}"
            </Typography>
          )}

          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label={`Articles (${articleTotal})`} value="articles" />
              <Tab label={`Users (${userTotal})`} value="users" />
            </Tabs>
          </Box>

          {/* Search Results */}
          {renderResults()}
        </Box>
      </PageLayout>
    </ThemeProvider>
  );
}

export default SearchResults;
