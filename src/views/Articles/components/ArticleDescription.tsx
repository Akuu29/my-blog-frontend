import { useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import PageLayout from "../../../components/layout/PageLayout";
import { useArticle } from "../../../hooks/useArticle";

const theme = createTheme({
  typography: {
    fontFamily: "string",
  },
});

type ArticleProps = {
  leftSideBar?: React.ReactNode;
  rightSideBar?: React.ReactNode;
};

function ArticleDescription({ leftSideBar, rightSideBar }: ArticleProps) {
  const { articleId } = useParams<{ articleId: string }>();
  const { data: article, isPending, isError } = useArticle(articleId ?? "");

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <PageLayout leftSideBar={leftSideBar} rightSideBar={rightSideBar}>
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
          {article && (
            <Grid container spacing={1} alignItems={"flex-end"} sx={{ padding: 2 }}>
              <Grid item xs={12}>
                <Typography variant="h4">{article.title}</Typography>
              </Grid>
              {article.createdAt && (
                <Grid item xs={6}>
                  <Typography variant="body1" color="text.secondary">
                    created: {format(article.createdAt, "MMMM dd, yyyy")}
                  </Typography>
                </Grid>
              )}
              {article.updatedAt !== article.createdAt && (
                <Grid item xs={12}>
                  <Typography variant="body1" color="text.secondary">
                    updated: {format(article.updatedAt, "MMMM dd, yyyy")}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <MarkdownPreview
                  source={article.body}
                  style={{
                    backgroundColor: "transparent",
                    color: "inherit",
                    fontFamily: "string",
                  }}
                  wrapperElement={{ "data-color-mode": "light" }}
                  skipHtml={true}
                  rehypePlugins={[rehypeSanitize]}
                />
              </Grid>
            </Grid>
          )}
        </PageLayout>
      </Grid>
    </ThemeProvider>
  );
}

export default ArticleDescription;
