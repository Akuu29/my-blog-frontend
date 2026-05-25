import { useSearchParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import PageLayout from "../../../components/layout/PageLayout";
import ArticleList from "../components/ArticleList";
import { useArticles } from "../../../hooks/useArticles";
import { ARTICLES_PER_PAGE } from "../../../config/constants";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  }
});

function Articles() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const { data, isPending, isError } = useArticles({ status: "published" }, page);

  const totalPages = Math.ceil((data?.total ?? 0) / ARTICLES_PER_PAGE);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: String(value) });
    window.scrollTo(0, 0);
  };

  const leftSideBar = (
    <Stack spacing={1}>
      {/* TODO */}
    </Stack>
  );

  const rightSideBar = (
    <Stack spacing={1}>
      {/* TODO */}
    </Stack>
  );

  return (
    <ThemeProvider theme={theme}>
      <PageLayout
        leftSideBar={leftSideBar}
        rightSideBar={rightSideBar}
      >
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
          <>
            <Stack spacing={2} sx={{ margin: 5 }}>
              <ArticleList articles={data.items} />
            </Stack>
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
          </>
        )}
      </PageLayout>
    </ThemeProvider>
  );
}

export default Articles;
