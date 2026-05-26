import { useLocation, useParams, useSearchParams, Link as RouterLink } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";

import PageLayout from "../components/layout/PageLayout";
import { useArticlesByCategory } from "../hooks/useArticlesByCategory";
import { ARTICLES_PER_PAGE } from "../config/constants";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  },
});

function ArticlesByCategory() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { categoryName } = useLocation().state;

  const [searchParams, setSearchParams] = useSearchParams();
  const rawPage = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const { data, isPending, isError } = useArticlesByCategory(categoryId ?? "", page);
  const totalPages = Math.ceil((data?.total ?? 0) / ARTICLES_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
    window.scrollTo(0, 0);
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
      <PageLayout leftSideBar={leftSideBar} rightSideBar={rightSideBar}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ width: "fit-content", margin: "0 auto", textAlign: "center" }}>
            <Typography sx={{ fontFamily: "monospace", fontWeight: 500, fontSize: "1.5rem" }}>
              {categoryName}
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
          {data && (
            <Box sx={{ textAlign: "left" }}>
              {data.items.map((article) => (
                <Link
                  component={RouterLink}
                  to={`/article/${article.id}`}
                  key={article.id}
                  underline="hover"
                  sx={{ cursor: "pointer" }}
                >
                  <Typography sx={{ fontFamily: "monospace", m: 2 }}>
                    ・{article.title}
                  </Typography>
                </Link>
              ))}
            </Box>
          )}
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", pb: 4 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
          </Box>
        )}
      </PageLayout>
    </ThemeProvider>
  );
}

export default ArticlesByCategory;
