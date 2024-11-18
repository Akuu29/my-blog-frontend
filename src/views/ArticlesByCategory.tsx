import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import type { ArticlesByCategory } from "../types/category";
import { CategoryApi } from "../services/category_api";
import handleError from "../utils/handle-error";
import { ErrorResponse } from "../types/error_response";
import { ErrorSnackbarContext } from "../contexts/ErrorSnackbarContext";
import type { ErrorSnackbarContextProps } from "../types/error_snackbar_context";

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

  return (
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
  );
}

export default ArticlesByCategory;
