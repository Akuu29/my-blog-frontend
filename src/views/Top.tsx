import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import PageLayout from "../components/layout/PageLayout";
import ArticleApi from "../services/article-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { Article } from "../types/article";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import { RECENT_ARTICLES_COUNT } from "../config/constants";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

function Top() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const [recentArticles, setRecentArticles] = useState<Array<Article>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecentArticles = async () => {
      setLoading(true);

      const result = await ArticleApi.all(
        { status: "published" },
        { cursor: null, perPage: RECENT_ARTICLES_COUNT }
      );

      if (result.isOk()) {
        const body = result.unwrap();
        setRecentArticles(body.items);
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
      }

      setLoading(false);
    };

    fetchRecentArticles();
  }, [navigate]);

  const onClickArticle = (article: Article) => {
    navigate(`/article/${article.id}`);
  };

  const onViewAllArticles = () => {
    navigate('/articles');
  };

  return (
    <ThemeProvider theme={theme}>
      <PageLayout>
        <Container maxWidth="lg">
          {/* Welcome Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
              Welcome to SpaceShelf
            </Typography>
            <Typography variant="h6" sx={{ color: '#7f8c8d', maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
              SpaceShelf is your personal digital shelf where you can store and organize various content.
              Currently designed as a curated space for blog articles, SpaceShelf serves as your knowledge repository -
              a place where ideas, insights, and stories find their home on your virtual shelf.
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Recent Articles Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#34495e' }}>
              Recent Articles
            </Typography>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography>Loading recent articles...</Typography>
              </Box>
            ) : recentArticles.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No articles available yet.</Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {recentArticles.map((article) => (
                  <Grid item xs={12} key={article.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => onClickArticle(article)}
                    >
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {format(new Date(article.updatedAt), "MMMM dd, yyyy")}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <div style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                          }}>
                            <MarkdownPreview
                              source={article.body}
                              style={{
                                backgroundColor: "transparent",
                                color: "inherit",
                                fontFamily: "string",
                              }}
                              skipHtml={true}
                              rehypePlugins={[rehypeSanitize]}
                            />
                          </div>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {recentArticles.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="text"
                  size="large"
                  onClick={onViewAllArticles}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': {
                      color: '#2980b9',
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  <Typography sx={{
                    fontFamily: "monospace"
                  }}>
                    ...View More Articles
                  </Typography>
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </PageLayout>
    </ThemeProvider >
  );
}

export default Top;
