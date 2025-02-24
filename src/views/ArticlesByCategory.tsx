import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import PageLayout from "../components/layout/PageLayout";
import CalendarWidget from "../components/layout/side-bar-widget/CalendarWidget/CalendarWidget";
import CategoryWidget from "../components/layout/side-bar-widget/CategoryWidget/CategoryWidget";

import CategoryApi from "../services/category-api";
import handleError from "../utils/handle-error";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { ErrorResponse } from "../types/error-response";
import type { ErrorSnackbarContextProps } from "../types/error-snackbar-context";
import type { ArticlesByCategory } from "../types/category";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  },
});

function ArticlesByCategory() {
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const { category_name } = useParams();
  const [articles, setArticles] = useState<Array<ArticlesByCategory>>();

  useEffect(() => {
    (async () => {
      const result = await CategoryApi.find_articles_by_category(category_name as string);

      if (result.isOk()) {
        setArticles(result.value);
      }

      handleError(result.unwrap() as ErrorResponse, navigate, openSnackbar, "top", "center");
    })();
  }, [category_name, setArticles, navigate, openSnackbar]);

  const handleClickArticle = (article_id: number) => {
    navigate(`/article/${article_id}`);
  };

  const leftSideBar = (
    <Stack spacing={1}>
      <CalendarWidget />
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      <CategoryWidget />
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
              {category_name}
            </Typography>
          </Box>
          <Box sx={{
            textAlign: "left",
          }}>
            {articles?.map((article) => (
              <Link
                underline="hover"
                sx={{ cursor: "pointer" }}
                onClick={() => handleClickArticle(article.article_id)}
                key={article.article_id}
              >
                <Typography
                  key={article.article_id}
                  sx={{
                    fontFamily: "monospace",
                    m: 2,
                  }}>
                  ・{article.article_title}
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
