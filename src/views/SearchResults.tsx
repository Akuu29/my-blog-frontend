import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import PageLayout from "../components/layout/PageLayout";
import ArticleList from "./Articles/ArticleList";
import UserList from "./UserList";

import ArticleApi from "../services/article-api";
import UserApi from "../services/user-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { Article } from "../types/article";
import type { User } from "../types/user";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

type SearchType = 'articles' | 'users';

function SearchResults() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const [searchParams] = useSearchParams();
  const [articles, setArticles] = useState<Array<Article>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<SearchType>('articles');

  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      const trimmedSearchQuery = searchQuery.trim();
      if (!trimmedSearchQuery) {
        setArticles([]);
        setUsers([]);
        setHasSearched(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      const [articlesResult, usersResult] = await Promise.all([
        ArticleApi.all(
          { status: "published", titleContains: trimmedSearchQuery },
          { cursor: null, perPage: 50 }
        ),
        UserApi.all(
          { nameContains: trimmedSearchQuery },
          { cursor: null, perPage: 50 }
        )
      ]);

      if (articlesResult.isOk()) {
        const body = articlesResult.unwrap();
        setArticles(body.items);
      } else if (articlesResult.isErr()) {
        handleError(articlesResult.unwrap(), navigate, openSnackbar, "top", "center");
        setArticles([]);
      }

      if (usersResult.isOk()) {
        const body = usersResult.unwrap();
        setUsers(body.items);
      } else if (usersResult.isErr()) {
        handleError(usersResult.unwrap(), navigate, openSnackbar, "top", "center");
        setUsers([]);
      }

      setLoading(false);
    };

    fetchSearchResults();
  }, [searchQuery, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: SearchType) => {
    setCurrentTab(newValue);
  };

  const leftSideBar = (
    <Stack spacing={1}>
      {/* <CalendarWidget /> */}
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      {/* <CategoryWidget />
      <TagWidget setSelectedTags={() => { }} /> */}
    </Stack>
  );

  const getResultCount = (type: SearchType) => {
    return type === 'articles' ? articles.length : users.length;
  };

  const renderResults = () => {
    if (loading) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography>Searching articles and users...</Typography>
        </Box>
      );
    }

    if (!hasSearched || !searchQuery) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Please enter a search term to find articles and users.
        </Alert>
      );
    }

    const articleCount = getResultCount('articles');
    const userCount = getResultCount('users');

    if (articleCount === 0 && userCount === 0) {
      return (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No articles or users found for "{searchQuery}". Try different keywords.
        </Alert>
      );
    }

    return (
      <>
        {currentTab === 'articles' ? (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Found {articleCount} article{articleCount !== 1 ? 's' : ''}
            </Typography>
            {articleCount > 0 ? (
              <ArticleList articles={articles} />
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No articles found for "{searchQuery}".
              </Alert>
            )}
          </>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Found {userCount} user{userCount !== 1 ? 's' : ''}
            </Typography>
            {userCount > 0 ? (
              <UserList users={users} />
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No users found for "{searchQuery}".
              </Alert>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
        <Box sx={{ py: 2 }}>
          {/* Search Header */}
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Search Results
          </Typography>

          {searchQuery && (
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Searching for: "{searchQuery}"
            </Typography>
          )}

          {/* Search Type Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab
                label={`Articles (${getResultCount('articles')})`}
                value="articles"
              />
              <Tab
                label={`Users (${getResultCount('users')})`}
                value="users"
              />
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
