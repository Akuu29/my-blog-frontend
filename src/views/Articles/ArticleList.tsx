import { useState, useContext } from "react";
import { format } from "date-fns";
import MarkdownPreview from "@uiw/react-markdown-preview";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";

import { useNavigate } from "react-router-dom";
import { UserStatusContext } from "../../contexts/UserStatusContext";
import type { Article } from "../../types/article";
import type { UserStatusContextProps } from "../../types/user-status-context";

const ARTICLES_PER_PAGE = 7;

type ArticleListProps = {
  articles: Array<Article>;
}

function ArticleList({ articles }: ArticleListProps) {
  const navigate = useNavigate();
  const userStatus = useContext(UserStatusContext) as UserStatusContextProps;

  const onClickArticle = (article: Article) => {
    navigate(`/article/${article.id}`);
  };

  // Pagination
  const [page, setPage] = useState(1);
  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const startIndex = (page - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  return (
    <Stack spacing={2} direction="column" sx={{ margin: 5 }}>
      {userStatus.isLoggedIn && (
        <IconButton
          disableRipple={true}
          sx={{
            cursor: "pointer"
          }}
          onClick={() => { navigate("/editor"); }}>
          <AddIcon />
          <Typography sx={{
            variant: "h1",
            fontWeight: 600,
          }}>
            Add New Article
          </Typography>
        </IconButton>
      )}
      {paginatedArticles.map((article => (
        <Card sx={{ height: 230, padding: 1 }} variant="elevation" key={article.id} onClick={() => onClickArticle(article)}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h4">
                {article.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                {format(article.updatedAt, "MMMM dd, yyyy")}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
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
                />
              </Typography>
            </Grid>
          </Grid>
        </Card>
      )))}
      <Box sx={{
        display: "flex",
        justifyContent: "center",
      }}>
        <Pagination
          count={Math.ceil(articles.length / ARTICLES_PER_PAGE)}
          size="small"
          page={page}
          onChange={handleChangePage} />
      </Box>
    </Stack>
  );
}

export default ArticleList;
