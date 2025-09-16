import { useEffect, useState, useContext, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import PageLayout from "../components/layout/PageLayout";

import ArticleApi from "../services/article-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  },
});

type ArticlesByCategory = {
  articleId: string;
  articleTitle: string;
};

function ArticlesByCategory() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const { categoryId } = useParams();
  const { categoryName } = useLocation().state;
  const [articlesByCategory, setArticlesByCategory] = useState<Array<ArticlesByCategory>>();

  useEffect(() => {
    (async () => {
      const result = await ArticleApi.all(
        { status: "published", categoryId: categoryId, },
        { perPage: 20, }
      );

      if (result.isOk()) {
        setArticlesByCategory(result.value.items.map((article) => ({
          articleId: article.id,
          articleTitle: article.title,
        })));
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
      }
    })();
  }, [categoryId, categoryName, navigate]);

  const handleClickArticle = (articleId: string) => {
    navigate(`/article/${articleId}`);
  };

  const leftSideBar = (
    <Stack spacing={1}>
      {/* reserved for future public widgets */}
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      {/* reserved for future public widgets */}
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
          <Box sx={{
            width: "fit-content",
            margin: "0 auto",
            textAlign: "center",
          }}>
            <Typography sx={{
              fontFamily: "monospace",
              variant: "h1",
              fontWeight: 500,
              fontSize: "1.5rem",
            }}>
              {categoryName}
            </Typography>
          </Box>
          <Box sx={{
            textAlign: "left",
          }}>
            {articlesByCategory?.map((article) => (
              <Link
                underline="hover"
                sx={{ cursor: "pointer" }}
                onClick={() => handleClickArticle(article.articleId)}
                key={article.articleId}
              >
                <Typography
                  key={article.articleId}
                  sx={{
                    fontFamily: "monospace",
                    m: 2,
                  }}>
                  ・{article.articleTitle}
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
      </PageLayout>
    </ThemeProvider>
  );
}

export default ArticlesByCategory;
