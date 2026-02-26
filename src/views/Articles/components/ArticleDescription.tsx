import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import rehypeSanitize from "rehype-sanitize";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import PageLayout from "../../../components/layout/PageLayout";
import ArticleApi from "../../../services/article-api";
import handleError from "../../../utils/handle-error";
import { ErrorSnackbarContext } from "../../../contexts/ErrorSnackbarContext";
import type { Article } from "../../../types/article";
import type { ErrorSnackbarContextProps } from "../../../types/error-snackbar-context";

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
  const navigate = useNavigate();
  const { openSnackbar } = useContext(ErrorSnackbarContext) as ErrorSnackbarContextProps;
  const openSnackbarRef = useRef(openSnackbar);
  useEffect(() => { openSnackbarRef.current = openSnackbar; }, [openSnackbar]);

  const { articleId } = useParams<{ articleId: string }>();
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    (async () => {
      if (!articleId) {
        return;
      }

      const result = await ArticleApi.find(articleId);

      if (result.isOk()) {
        setArticle(result.unwrap());
      } else if (result.isErr()) {
        handleError(result.unwrap(), navigate, openSnackbarRef.current, "top", "center");
      }
    })();
  }, [articleId, navigate]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <PageLayout
          leftSideBar={leftSideBar}
          rightSideBar={rightSideBar}
        >
          <Grid container spacing={1} alignItems={"flex-end"} sx={{ padding: 2 }}>
            <Grid item xs={12}>
              <Typography variant="h4">
                {article?.title}
              </Typography>
            </Grid>
            {article?.createdAt && (
              <Grid item xs={6}>
                <Typography variant="body1" color="text.secondary">
                  created: {format(article!.createdAt, "MMMM dd, yyyy")}
                </Typography>
              </Grid>
            )}
            {article?.updatedAt !== article?.createdAt && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary">
                  updated: {format(article!.updatedAt, "MMMM dd, yyyy")}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <MarkdownPreview
                source={article?.body}
                style={{
                  backgroundColor: "transparent",
                  color: "inherit",
                  fontFamily: "string",
                }}
                skipHtml={true}
                rehypePlugins={[rehypeSanitize]}
              />
            </Grid>
          </Grid >
        </PageLayout>
      </Grid>
    </ThemeProvider>
  );
}

export default ArticleDescription;
